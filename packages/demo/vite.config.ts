import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
            {
              find: /^@storyblok\/field-plugin$/,
              replacement: path.resolve(
                __dirname,
                '../field-plugin/src/index.ts',
              ),
            },
            {
              find: /^@storyblok\/field-plugin\/react$/,
              replacement: path.resolve(
                __dirname,
                '../lib-helpers/react/src/index.ts',
              ),
            },
          ],
  },
  server: {
    port: 8080,
    host: true,
  },
})
