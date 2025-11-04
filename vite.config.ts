// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
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
})