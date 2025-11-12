import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number.parseInt(process.env.PORT ?? '5173', 10),
  },
  preview: {
    host: '0.0.0.0',
    port: Number.parseInt(process.env.PORT ?? '4173', 10),
    allowedHosts: ['frontend-project-537w.onrender.com'],
  },
})
