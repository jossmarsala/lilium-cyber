// Vite path alias config — allows `@/` imports throughout the project
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@react-ui-os/core': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/core/src'),
      '@react-ui-os/desktop': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/desktop/src'),
      '@react-ui-os/theme-macos': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/theme-macos/src'),
      '@react-ui-os/theme-windows': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/theme-windows/src'),
      '@react-ui-os/theme-ubuntu': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/theme-ubuntu/src'),
      '@react-ui-os/example-apps': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/example-apps/src'),
      '@react-ui-os/icons': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/icons/src'),
      '@react-ui-os/demo': resolve(import.meta.dirname, 'node_modules/react-ui-os/packages/demo/src'),
    },
    conditions: ['source'],
    dedupe: ['react', 'react-dom'],
  },
})

