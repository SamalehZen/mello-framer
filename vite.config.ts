import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    // Inline the many tiny decorative SVGs instead of paying a request each.
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Keep React and its runtime in a stable chunk so app changes don't
        // bust its cache. Match by module path so react-dom/view internals are
        // captured too, not just the package entrypoints.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor'
          return undefined
        },
      },
    },
  },
})
