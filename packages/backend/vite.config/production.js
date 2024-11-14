import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    target: 'esnext',
    outDir: 'dist/web',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
