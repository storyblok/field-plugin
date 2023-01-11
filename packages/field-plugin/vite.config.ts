import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'index', // TODO why does the name become "field-plugin"?
    },
  },
})
