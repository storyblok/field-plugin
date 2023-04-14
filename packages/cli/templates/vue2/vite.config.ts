import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import printPlugin from './print-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin(), printPlugin()],
  build: {
    // minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  // @ts-expect-error this is coming from vitest
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    port: 8080,
    host: true,
  },
})
