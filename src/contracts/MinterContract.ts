import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano
} from '@ton/core';

export type MinterConfig = {
    totalSupply: bigint;           // 0 для старта
    adminAddress: Address;
    content: Cell;
    jettonWalletCode: Cell;
    trustedDistributorsList: Cell; // пока заглушка
};

// 🔥 OP-код из контракта!
const OP_CLAIM_TOKENS = 0x12345678n;  // из op-codes.fc

//const GAS_RESERVE = toNano('0.2');

// Для токена из контракта!
export function buildContent(uri: string): Cell {
    return beginCell()
        .storeUint(1, 8)
        .storeStringTail(uri)
        .endCell();
}

export class MinterContract implements Contract {
    constructor(readonly address: Address,
                readonly init?: { code: Cell; data: Cell }) {}

    static createFromConfig(config: MinterConfig, code: Cell, workchain = 0): MinterContract {
        const data = beginCell()
            .storeCoins(config.totalSupply)
            .storeAddress(config.adminAddress)
            .storeRef(config.content)
            .storeRef(config.jettonWalletCode)
            .storeRef(config.trustedDistributorsList)
            .endCell();

        const init = { code, data };
        return new MinterContract(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint = toNano('1')) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }

    async sendClaimTokens(
        provider: ContractProvider,
        via: Sender,
        opts: {
            toAddress: Address;
            jettonAmount: bigint;      // ← ТВОЁ название!
            forwardTonAmount?: bigint; // ← ТВОЁ название!
            value?: bigint;
            queryId?: bigint;
        }
    ) {
        const forwardTon = opts.forwardTonAmount ?? toNano('0.05');
        const value = opts.value ?? (forwardTon + toNano('0.2'));
        const queryId = opts.queryId ?? BigInt(Math.floor(Math.random() * 1_000_000_000));

        const body = beginCell()
            .storeUint(OP_CLAIM_TOKENS, 32)
            .storeUint(queryId, 64)
            .storeAddress(opts.toAddress)
            .storeCoins(opts.jettonAmount)    // ← ТВОЁ название!
            .storeCoins(forwardTon)
            .endCell();

        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body
        });
    }

    async getJettonData(provider: ContractProvider) {
        const res = await provider.get('get_jetton_data', []);
        return {
            totalSupply: res.stack.readBigNumber(),
            mintable: res.stack.readNumber(),
            adminAddress: res.stack.readAddress(),
            content: res.stack.readCell(),
            walletCode: res.stack.readCell()
        };
    }

    async getContractData(provider: ContractProvider) {
        const res = await provider.get('get_contract_data', []);
        return {
            totalSupply: res.stack.readBigNumber(),
            adminAddress: res.stack.readAddress(),
            content: res.stack.readCell(),
            walletCode: res.stack.readCell(),
            trustedDistributorsList: res.stack.readCell()
        };
    }

    async getWalletAddress(provider: ContractProvider, owner: Address) {
        const res = await provider.get('get_wallet_address', [
            { type: 'slice', cell: beginCell().storeAddress(owner).endCell() }
        ]);
        return res.stack.readAddress();
    }

    static createFromAddress(address: Address): MinterContract {
        return new MinterContract(address);
    }
}