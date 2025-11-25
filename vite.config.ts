// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
<<<<<<< HEAD
export default defineConfig(({ mode }) => {
  const isGh = mode === 'gh';
  return {
    plugins: [react()],
    // Utiliser un base différent selon la cible (Vercel: '/', GitHub Pages: sous-chemin)
    base: isGh ? '/dictionnaire-nzebi-fran-ais/' : '/',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
=======
export default defineConfig({
  plugins: [react()],
  
  // FIX: Remplacer la logique conditionnelle par le chemin STATIQUE de GitHub Pages
  base: '/dictionnaire-nzebi-fran-ais/', 
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
})