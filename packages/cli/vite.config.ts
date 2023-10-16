import { resolve } from 'path'
import { configDefaults, defineConfig } from 'vitest/config'
import pkg from './package.json'
const externalDependencies = [
  'fs',
  'path',
  'os',
  'url',
  ...Object.keys(pkg.dependencies),
]

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'templates'],
    globals: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: 'main',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: (id) => {
        return externalDependencies.includes(id.split('/')[0])
      },
    },
  },
})
