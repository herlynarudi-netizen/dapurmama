// Mengimpor fungsi dan library yang dibutuhkan
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Plugin untuk React
import path from "path";
import { componentTagger } from "lovable-tagger";

// --- PENGATURAN UNTUK GITHUB PAGES ---
// Pastikan nama ini SAMA PERSIS dengan nama repository Anda di GitHub.
const repoName = '/dapurmama/';
// ------------------------------------

// Ini adalah konfigurasi utama Vite
export default defineConfig(({ mode }) => ({
  // Baris ini secara cerdas mengatur base path:
  // - Saat 'npm run build' (production), base path akan menjadi '/dapurmama/'
  // - Saat 'npm run dev' (development), base path akan menjadi '/'
  base: mode === 'production' ? repoName : '/',

  // Pengaturan untuk server development lokal
  server: {
    host: "::",
    port: 8080,
  },
  
  // Daftar plugin yang digunakan
  plugins: [
    react(),  
    // lovable-tagger hanya aktif saat development untuk membantu debugging
    mode === "development" && componentTagger()
  ].filter(Boolean), // Trik untuk menghapus plugin yang non-aktif

  // Pengaturan 'alias' untuk path import yang lebih pendek (contoh: import dari '@/components')
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
