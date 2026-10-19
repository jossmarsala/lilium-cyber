// Vite path alias config — allows `@/` imports throughout the project
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'child_process'

function compileLabsWatcherPlugin(): Plugin {
  return {
    name: 'compile-labs-watcher',
    buildStart() {
      try {
        execSync('node scripts/compile-labs.ts', { stdio: 'inherit' })
      } catch (err) {
        console.error('[vite] Initial lab compilation error:', err)
      }
    },
    configureServer(server) {
      const labsDir = resolve(import.meta.dirname, 'docs/labs')
      server.watcher.add(labsDir)

      let timer: NodeJS.Timeout | null = null
      const debouncedCompile = () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          try {
            console.log('[vite] Lab file changed, recompiling labs...')
            execSync('node scripts/compile-labs.ts', { stdio: 'inherit' })
          } catch (err) {
            console.error('[vite] Failed to recompile labs:', err)
          }
        }, 80)
      }

      server.watcher.on('change', (file) => {
        if (file.includes('docs/labs')) {
          debouncedCompile()
        }
      })
      server.watcher.on('add', (file) => {
        if (file.includes('docs/labs')) {
          debouncedCompile()
        }
      })
      server.watcher.on('unlink', (file) => {
        if (file.includes('docs/labs')) {
          debouncedCompile()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), compileLabsWatcherPlugin()],
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
