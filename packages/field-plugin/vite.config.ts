import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import dts from 'vite-plugin-dts'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      compilerOptions: {
        outFile: 'index.js',
      },
      afterBuild: () => {
        copyFileSync('dist/index.d.ts', 'dist/index.d.cts')
      },
    }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'FieldPlugin',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    emptyOutDir: false,
  },
})
