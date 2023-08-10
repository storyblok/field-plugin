import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { plugins } from '@storyblok/field-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin(), ...plugins],
  build: {
    rollupOptions: {
      external: ["vue"],
      output: {
        format: 'es',
        entryFileNames: `temp.js`,
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

