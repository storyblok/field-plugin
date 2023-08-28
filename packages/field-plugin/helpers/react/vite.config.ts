import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // there is a typing problem with the dts package
  plugins: [dts() as unknown as PluginOption, react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactHelper',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@storyblok/field-plugin'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@storyblok/field-plugin': 'FieldPlugin',
        },
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
              replacement: resolve(__dirname, '../field-plugin/src/index.ts'),
            },
          ],
  },
})
