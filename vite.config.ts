import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tonTest/',  // ← ИМЯ РЕПО!
  server: {
    port: 5173
  }
})