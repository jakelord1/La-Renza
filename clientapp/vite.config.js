import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7071', // .NET backend port
        changeOrigin: true,
        secure: false
      }
    },
  }
})
