import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import printPlugin from './print-plugin'

export default defineConfig({
  plugins: [cssInjectedByJsPlugin(), printPlugin()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  server: {
    port: 8080,
    host: true,
  },
})
