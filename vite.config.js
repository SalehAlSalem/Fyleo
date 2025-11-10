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
    host: true,
    proxy: {
      // Proxy Meilisearch requests to bypass browser CORS/SSL issues
      '/api/meili': {
        target: 'https://minio97.chickenkiller.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/meili/, '/meili'),
        secure: false, // Allow self-signed certificates
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'appwrite', '@tanstack/react-query']
  }
})
