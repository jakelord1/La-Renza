import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7071', // .NET backend port
        changeOrigin: true,
        secure: false
      }
    },
    https: {
      key: fs.readFileSync('./cert/localhost-key.pem'),
      cert: fs.readFileSync('./cert/localhost-cert.pem'),
    },
  }
})
