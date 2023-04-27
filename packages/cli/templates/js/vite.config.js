import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { fieldPlugin } from './fieldPlugin'

export default defineConfig({
  plugins: [cssInjectedByJsPlugin(), fieldPlugin()],
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
