import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useState } from 'react';
import { useMinterContract } from './hooks/useMinter';
import { Address, toNano } from '@ton/core';
import './App.css';

export default function App() {
    const [counter, setCounter] = useState(0);
    const myAddress = useTonAddress();
    const connected = !!myAddress;
    const { sendClaimTokens, totalSupply, connected: contractConnected } = useMinterContract();

    const handleClaim = async () => {
        if (!myAddress || counter < 10) {
            alert(`Нужно ${10 - counter} кликов еще!`);
            return;
        }

        try {
            console.log('Claiming tokens...');
            await sendClaimTokens({
                toAddress: Address.parse(myAddress),
                jettonAmount: toNano("1"),
                forwardTonAmount: toNano("0.05")
            });

            alert('✅ Транзакция отправлена! Ждите токены...');
            setCounter(0);
        } catch (e) {
            console.error('Mint error:', e);
            alert('❌ Ошибка: ' + (e instanceof Error ? e.message : 'Неизвестная ошибка'));
        }
    };

    return (
        <div className="app">
            <h1 className="title">🪨 MTT Clicker</h1>

            <div className="ton-connect-button">
                <TonConnectButton />
            </div>

            {connected ? (
                <>
                    <div className="counter">
                        {counter}
                    </div>

                    <button
                        className="click-btn"
                        onClick={() => setCounter(c => c + 1)}
                    >
                        CLICK!
                    </button>

                    {/* ← ИЗМЕНЕНО: было 1000, стало 10 */}
                    {counter >= 10 && (
                        <button
                            className="claim-btn"
                            onClick={handleClaim}
                        >
                            Claim 1 MTT! 🎉
                        </button>
                    )}
                </>
            ) : (
                <div className="connect-message">
                    Connect Tonkeeper to play!
                </div>
            )}

            <div className="message">
                {/* ← ИЗМЕНЕНО: было 1000, стало 10 */}
                {counter >= 10 ? (
                    '🎯 Можно заклеймить!'
                ) : (
                    `${10 - counter} кликов до 1 MTT`
                )}
            </div>

            {totalSupply !== undefined && (
                <div className="total-supply">
                    Total Minted: {totalSupply.toString()} MTT
                </div>
            )}

            {!contractConnected && connected && (
                <div className="warning" style={{color: 'orange'}}>
                    ⚠️ Контракт не подключен
                </div>
            )}
        </div>
    );
}