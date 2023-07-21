import { resolve } from 'path'
import { configDefaults, defineConfig } from 'vitest/config'

// test
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
      external: [
        'prompts',
        'kleur',
        'fs',
        'os',
        'path',
        'walkdir',
        'execa',
        'node-fetch',
        'commander',
        'fs-extra',
      ],
    },
  },
})
