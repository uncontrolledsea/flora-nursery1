import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'https://flora-nursery1.onrender.com', changeOrigin: true },
      '/uploads': { target: 'https://flora-nursery1.onrender.com', changeOrigin: true },
    }
  }
})
