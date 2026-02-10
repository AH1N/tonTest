import { useEffect, useState } from "react";
import { MinterContract } from "../contracts/MinterContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, toNano } from "@ton/core";

const MINTER_ADDRESS = Address.parse("EQТВОЙ_МИНТЕР_АДРЕС"); // ← ЗАМЕНИ!

export function useMinterContract() {
    const client = useTonClient();           // ✅ RPC клиент
    const { sender } = useTonConnect();      // ✅ Tonkeeper sender

    const [data, setData] = useState<null | {
        totalSupply: bigint;
        adminAddress: Address;
    }>(null);

    // ✅ Открываем контракт
    const minter = useAsyncInitialize(async () => {
        if (!client) return null;
        const contract = new MinterContract(MINTER_ADDRESS);
        return client.open(contract) as OpenedContract<MinterContract>;
    }, [client]);

    // ✅ Загружаем данные
    useEffect(() => {
        async function load() {
            if (!minter) return;
            const d = await minter.getJettonData(); // или getContractData()
            setData({
                totalSupply: d.totalSupply,
                adminAddress: d.adminAddress,
            });
        }
        load();
    }, [minter]);

    // ✅ Отправляем claim
    const sendClaimTokens = async (opts: {
        toAddress: Address;
        jettonAmount: bigint;
        forwardTonAmount: bigint;
    }) => {
        if (!minter || !sender) return;
        return minter.sendClaimTokens(sender, {
            value: toNano("0.35"),
            toAddress: opts.toAddress,
            jettonAmount: opts.jettonAmount,
            forwardTonAmount: opts.forwardTonAmount,
            queryId: 0n,
        });
    };

    return {
        minter_address: minter?.address.toString(),
        totalSupply: data?.totalSupply,
        adminAddress: data?.adminAddress,
        minter,
        sendClaimTokens,
        connected: !!client && !!sender
    };
}