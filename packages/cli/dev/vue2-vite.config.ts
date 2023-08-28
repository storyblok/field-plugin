import { defineConfig } from 'vite'
import base from '../templates/vue2/vite.config'
import path from 'path'

export default defineConfig({
  ...base,
  resolve: {
    alias: [
      {
        find: /^@storyblok\/field-plugin$/,
        replacement: path.resolve(__dirname, '../../field-plugin/src/index.ts'),
      },
    ],
  },
})
