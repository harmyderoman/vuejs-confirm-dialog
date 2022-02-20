/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineConfig } from 'vite'

// for Vue 3 use this:
import vue from '@vitejs/plugin-vue'

// for Vue 2 use this:
// import { createVuePlugin as vue } from 'vite-plugin-vue2'

const path = require('path')

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
      fileName: (format) => `vuejs-confirm-dialog.${format}.js`,
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
})
