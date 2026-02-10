import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useState } from 'react';

export default function App() {
    const [counter, setCounter] = useState(0);
    const myAddress = useTonAddress(); // ← Адрес кошелька
    const connected = !!myAddress;     // ← Подключён?

    return (
        <div style={{
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            maxWidth: '400px',
            margin: '0 auto'
        }}>
            <h1 style={{ color: '#007AFF' }}>🪨 MTT Clicker</h1>

            {/* ← КНОПКА ПОДКЛЮЧЕНИЯ */}
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
                <button
                    style={{
                        width: '100%',
                        height: '80px',
                        fontSize: '1.5em',
                        background: '#007AFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        cursor: 'pointer'
                    }}
                    onClick={() => setCounter(c => c + 1)}
                >
                    CLICK!
                </button>
            ) : (
                <div style={{ color: '#666', fontSize: '1.2em' }}>
                    Connect Tonkeeper to play!
                </div>
            )}

            <p style={{ marginTop: '20px', color: '#666' }}>
                {counter >= 1000 ? 'Готов к CLAIM!' : '1000 кликов = 1 MTT'}
            </p>
        </div>
    );
}