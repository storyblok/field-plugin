import { PluginOption } from 'vite'

const printPlugin = (): PluginOption => ({
  name: 'storyblok-field-plugin',
  writeBundle: () => {
    console.log(`
    To deploy to Storyblok, run
    
      > yarn deploy
    `)
  },
  buildStart: () => {
    console.log(`
    Partner Portal plugins:
      - https://app.storyblok.com/#/partner/fields
    My plugins:
      - https://app.storyblok.com/#/me/plugins
    
    Try out the app with the Field Plugin Sandbox:
      - https://storyblok-field-plugin-sandbox.vercel.app
    `)
  },
})

export default printPlugin
