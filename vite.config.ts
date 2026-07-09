import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For GitHub Pages deployment
  const isProduction = mode === 'production';
  const base = isProduction ? '/dictionnaire-nzebi-fran-ais/' : '/';
  
  return {
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    base: base,
    server: {
      host: "::",
      port: 8080
    },
    build: {
      assetsInlineLimit: 0,
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: 'assets/[name].js',
          assetFileNames: (assetInfo) => {
            // Keep images in root, not in assets folder
            if (assetInfo.name && /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(assetInfo.name)) {
              return '[name][extname]';
            }
            return 'assets/[name][extname]';
          },
          chunkFileNames: 'assets/[name].js',
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
