import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Atau '@vitejs/plugin-react'
import path from "path";
import { componentTagger } from "lovable-tagger";

// --- PENGATURAN UNTUK GITHUB PAGES ---
// Ganti 'nama-repo-anda' dengan NAMA REPOSITORY Anda yang sebenarnya di GitHub.
const repoName = '/nama-repo-anda/';
// ------------------------------------

export default defineConfig(({ mode }) => ({
  // Baris ini MENYEDIAKAN BASE PATH yang diperlukan oleh GitHub Pages
  base: mode === 'production' ? repoName : '/',

  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [
    react(), 
    // componentTagger hanya diperlukan dalam mode development (mode === "development")
    mode === "development" && componentTagger()
  ].filter(Boolean), // .filter(Boolean) akan menghilangkan nilai false/null

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));