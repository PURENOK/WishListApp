import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // или @vitejs/plugin-react

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Нужно для корректной работы Hot Reload в Docker на Windows
    },
    host: true, // Слушать все локальные адреса
    port: 5173,
  },
})