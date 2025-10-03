import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // React Router の SPA 用フォールバック
    historyApiFallback: true
  }
})
