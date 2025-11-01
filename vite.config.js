import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@app': '/src/app',
      '@shared': '/src/shared',
      '@features': '/src/features',
      '@services': '/src/services',
      '@config': '/src/config',
      '@types': '/src/types',
      '@lib': '/src/shared/lib'
    }
  },
  base: process.env.GITHUB_PAGES ? '/Fyleo/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          appwrite: ['appwrite'],
          query: ['@tanstack/react-query']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'appwrite', '@tanstack/react-query']
  }
})
