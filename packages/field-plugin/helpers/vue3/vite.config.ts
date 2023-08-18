import vue from '@vitejs/plugin-vue'
import { PluginOption, defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // there is a typing problem with the dts package
  plugins: [dts() as unknown as PluginOption, vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Vue3Helper',
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
})
