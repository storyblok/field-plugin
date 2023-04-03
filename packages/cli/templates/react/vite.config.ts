import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const plugin = (): PluginOption => ({
  name: 'field-plugin-print',
  watchChange: () => {
    console.log('watching')
  },
  configureServer: (server) => {
    console.log('Gello')
  },
  buildStart: () => {
    console.log()
    console.log()
    console.log('Deploy to Storyblok with')
    console.log('\n > npx @storyblok/field-plugin-cli deploy\n')
    console.log(
      'Personal access tokens (for deployment): https://app.storyblok.com/#/me/account?tab=token',
    )
    console.log(
      'Partner Portal plugins: https://app.storyblok.com/#/partner/fields',
    )
    console.log('Personal plugins: https://app.storyblok.com/#/me/plugins')
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin(), plugin()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  server: {
    port: 8080,
    host: true,
  },
})
