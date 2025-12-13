import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isGh = mode === 'gh';
  return {
    plugins: [react()],
    base: isGh ? '/dictionnaire-nzebi-fran-ais/' : '/',
    server: {
      port: 8080
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
