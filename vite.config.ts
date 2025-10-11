import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dapurmama/', // <--- TAMBAHKAN BARIS INI
  plugins: [react()],
})
