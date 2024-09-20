import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'FieldPlugin',
      fileName: 'field-plugin',
    },
    emptyOutDir: false,
  },
})
