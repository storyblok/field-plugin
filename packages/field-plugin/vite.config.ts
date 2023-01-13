import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'field-plugin',
    },
    emptyOutDir: false,
  },
  // resolve: {
  //   alias: {
  //     '@src': fileURLToPath(new URL('./src', import.meta.url)),
  //   },
  // },
})
