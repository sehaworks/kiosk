import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // path 모듈 추가

export default defineConfig({
  plugins: [react()],
  base: '/kiosk/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @/ 를 src/ 폴더로 매핑
    },
  },
})