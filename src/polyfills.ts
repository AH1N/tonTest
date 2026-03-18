import { Buffer } from 'buffer';

// Делаем Buffer доступным глобально
(window as any).Buffer = Buffer;
(window as any).global = window;
(window as any).process = { env: {} };