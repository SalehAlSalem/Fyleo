import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/Fyleo/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/minio-proxy': {
        target: 'http://79.76.119.182:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio-proxy/, ''),
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer'
    }
  }
})
