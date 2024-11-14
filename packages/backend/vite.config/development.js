import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    target: 'esnext',
    outDir: 'dist/web',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 4000,
    open: true,
    watch: {
      include: ['src/web/**/*'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
