import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Tailwind should be configured via PostCSS (postcss.config.js) and
// not added as a Vite plugin. Enable sourcemaps for production builds
// so runtime errors on platforms like Vercel show accurate stacks.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/Fyleo/' : '/',
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  },
})
