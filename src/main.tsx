import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <TonConnectUIProvider
            manifestUrl="https://AH1N.github.io/tonTest/tonconnect-manifest.json"
        >
            <App />
        </TonConnectUIProvider>
    </React.StrictMode>,
);