import type { PluginOption, ViteDevServer } from 'vite'
import { generateSandboxUrl } from './sandbox'
import { bold, green } from './utils/text'
import { arrows } from './utils/arrows'

export function watchConfigFile(): PluginOption {
  return {
    name: 'storyblok-field-plugin-watch-config-file',
    handleHotUpdate({ file, server }) {
      if (file.endsWith('field-plugin.config.json')) {
        printServerUrls(server)
      }
    },
  }
}

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
        printServerUrls(server)
      }
    },
  }
}

function printServerUrls(server: ViteDevServer) {
  if (!server.resolvedUrls) {
    return
  }
  const localUrl = server.resolvedUrls.local[0]
  const networkUrl = server.resolvedUrls.network[0]

  console.log(`
    ${arrows.green}  ${bold(
      'Partner Portal',
    )}:  https://app.storyblok.com/#/partner/fields
    ${arrows.green}  ${bold(
      'My plugins',
    )}:      https://app.storyblok.com/#/me/plugins
     
    ${arrows.green}  ${bold('Local')}:    ${localUrl}
    ${arrows.green}  ${bold('Network')}:  ${networkUrl}
        
  See the plugin in action on 
     
    ${arrows.green}  ${bold('Sandbox')}: ${generateSandboxUrl(localUrl)}
          `)
}

export const plugins = [printProd(), printDev(), watchConfigFile()]
