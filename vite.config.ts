import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { notesApiPlugin } from './plugins/notesApiPlugin.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), notesApiPlugin()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three-vendor'
          if (id.includes('framer-motion')) return 'framer-vendor'
        },
      },
    },
  },
})
