import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api and /auth requests to the Spring Cloud API Gateway during local development
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
