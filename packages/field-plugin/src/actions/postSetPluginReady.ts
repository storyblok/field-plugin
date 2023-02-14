import { postPluginMessage } from './postPluginMessage'
import { SetPluginReady } from './index'

/**
 * Informs the Storyblok Application that the plugin is loaded and ready to receive messages.
 */
export const postSetPluginReady: SetPluginReady = () =>
  postPluginMessage({
    event: 'loaded',
  })
