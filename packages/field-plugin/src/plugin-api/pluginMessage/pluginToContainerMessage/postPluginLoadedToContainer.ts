import { postMessageToContainer } from './postMessageToContainer'
import { OnPluginReady } from './actions'

/**
 * Informs the Storyblok Application that the plugin is loaded and ready to receive messages.
 */
export const postPluginLoadedToContainer: OnPluginReady = () =>
  postMessageToContainer({
    event: 'loaded',
  })
