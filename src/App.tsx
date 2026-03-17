import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useState } from 'react';
import { useMinterContract } from './hooks/useMinter';
import { Address, toNano } from '@ton/core';

export default function App() {
    const [counter, setCounter] = useState(0);
    const myAddress = useTonAddress();
    const connected = !!myAddress;
    const { sendClaimTokens, totalSupply } = useMinterContract();

    const handleClaim = async () => {
        if (!myAddress || counter < 1000) return;
        try {
            await sendClaimTokens({
                toAddress: Address.parse(myAddress),
                jettonAmount: toNano("1"),
                forwardTonAmount: toNano("0.05")
            });
            setCounter(0);
        } catch (e) {
            console.error('Mint error:', e);
        }
    };

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <h1 style={{ color: '#007AFF' }}>🪨 MTT Clicker</h1>

            <TonConnectButton />

            <div style={{
                fontSize: '4em',
                fontWeight: 'bold',
                margin: '30px 0',
                color: '#333'
            }}>
                {counter}
            </div>

            {connected ? (
                <>
                    <button
                        style={{
                            width: '100%',
                            height: '80px',
                            fontSize: '1.5em',
                            background: '#007AFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}
                        onClick={() => setCounter(c => c + 1)}
                    >
                        CLICK!
                    </button>

                    {counter >= 10 && (
                        <button
                            style={{
                                width: '100%',
                                height: '60px',
                                fontSize: '1.3em',
                                background: '#34C759',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                            onClick={handleClaim}
                        >
                            Claim 1 MTT!
                        </button>
                    )}
                </>
            ) : (
                <div style={{ color: '#666', fontSize: '1.2em' }}>
                    Connect Tonkeeper to play!
                </div>
            )}

            <p style={{ marginTop: '20px', color: '#666' }}>
                {counter >= 1000 ? '✅ Готов к CLAIM!' : '1000 кликов = 1 MTT'}
            </p>

            {totalSupply !== undefined && (
                <p style={{ color: '#007AFF', fontWeight: 'bold' }}>
                    Total Supply: {totalSupply.toString()}
                </p>
            )}
        </div>
    );
}
