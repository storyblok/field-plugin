import type { PluginOption } from 'vite'
import * as querystring from 'querystring'

const sandboxBaseUrl = `https://plugin-sandbox.storyblok.com/field-plugin`
const sandboxUrl = (fieldPluginUrl: string) => {
  const urlQuery = querystring.stringify({
    url: fieldPluginUrl,
  })
  return `${sandboxBaseUrl}?${urlQuery}`
}

const styles = {
  reset: '\u001b[0m',
  green: '\u001b[32m',
  bold: '\u001b[1m',
}

// Utility functions for printing to terminal

const green = (text: string) => `${styles.green}${text}${styles.reset}`
const bold = (text: string) => `${styles.bold}${text}${styles.reset}`

const arrow = green('➜')

export function printProd(): PluginOption {
  return {
    name: 'storyblok-field-plugin-print-prod',
    // https://vitejs.dev/guide/api-plugin.html#plugin-ordering
    enforce: 'post',
    writeBundle: () => {
      console.log(` 
  Deploy the plugin to production with:
  
    ${green('npm run deploy')}
      `)
    },
  }
}

export function printDev(): PluginOption {
  return {
    name: 'storyblok-field-plugin-print-dev',
    // https://vitejs.dev/guide/api-plugin.html#plugin-ordering
    enforce: 'post',
    // https://vitejs.dev/guide/api-plugin.html#conditional-application
    apply: 'serve',
    configureServer(server) {
      // Overrides the message that Vite prints out when the server is started. To reduce complexity, it does not include color
      server.printUrls = () => {
        const localUrl = server.resolvedUrls!.local[0]
        const networkUrl = server.resolvedUrls!.network[0]

        console.log(`
    ${arrow}  ${bold(
          'Partner Portal',
        )}:  https://app.storyblok.com/#/partner/fields
    ${arrow}  ${bold('My plugins')}:      https://app.storyblok.com/#/me/plugins
     
    ${arrow}  ${bold('Local')}:    ${localUrl}
    ${arrow}  ${bold('Network')}:  ${networkUrl}
        
  See the plugin in action on 
     
    ${arrow}  ${bold('Sandbox')}: ${sandboxUrl(localUrl)}
          `)
      }
    },
  }
}

export const plugins = [printProd(), printDev()]
