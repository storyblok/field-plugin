import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Vue2Helper',
      fileName: 'index',
    },

    rollupOptions: {
      external: ['vue', '@storyblok/field-plugin'],
      output: {
        globals: {
          vue: 'Vue',
          '@storyblok/field-plugin': 'FieldPlugin',
        },
      },
    },
  },
  resolve: {
    alias:
      process.env.node_env === 'production'
        ? []
        : [
            {
              find: /^@storyblok\/field-plugin$/,
              replacement: resolve(__dirname, '../field-plugin/src/index.ts'),
            },
          ],
  },
})
