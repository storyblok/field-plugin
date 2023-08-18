import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { plugins } from '@storyblok/field-plugin/vite'

export default defineConfig({
  plugins: [cssInjectedByJsPlugin(), ...plugins],
  build: {
    rollupOptions: {
      output: {
        format: 'commonjs',
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
