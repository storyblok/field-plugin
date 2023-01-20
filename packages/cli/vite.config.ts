import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    exclude: ['templates'],
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
        'path',
        'walkdir',
        'execa',
        'node-fetch',
        'commander',
      ],
    },
  },
});
