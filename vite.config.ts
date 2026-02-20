import tanstackRouter from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import * as child from 'child_process'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  define: {
    GIT_COMMIT_HASH: JSON.stringify(child.execSync('git rev-parse --short HEAD').toString()),
  },
  publicDir: 'public',
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'vendor-mui'
            if (id.includes('@tanstack')) return 'vendor-tanstack'
            if (id.includes('dayjs')) return 'vendor-dayjs'
          }
          return undefined
        },
      },
    },
  },
})
