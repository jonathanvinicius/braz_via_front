import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_'],
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
  },
})
