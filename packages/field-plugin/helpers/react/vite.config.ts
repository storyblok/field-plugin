import { PluginOption, defineConfig } from 'vite'
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
})
