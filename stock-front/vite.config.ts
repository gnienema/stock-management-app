import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,        // On change le port par défaut
    host: '127.0.0.1', // On force l'IPv4
  },
})