/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'vuejs-confirm-dialog',
      // package.json has "type": "module", so a plain .js UMD bundle would
      // be (wrongly) parsed as ESM by Node's require() - .cjs sidesteps that
      fileName: (format) =>
        format === 'umd'
          ? 'vuejs-confirm-dialog.umd.cjs'
          : `vuejs-confirm-dialog.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    environment: 'happy-dom'
  }
})
