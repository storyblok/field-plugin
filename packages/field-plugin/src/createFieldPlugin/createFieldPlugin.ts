import { PluginState } from './PluginState'
import { createPluginActions } from './createPluginActions'
import { createAutoResizer } from './createAutoResizer'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginUrlParamsFromUrl } from '../plugin-api'
import { PluginActions } from './PluginActions'

export type CreateFieldPlugin = (
  onUpdate: (state: PluginState) => void,
) => [undefined, undefined] | [PluginActions, () => void]

/**
 * @returns cleanup function
 */
// TODO rename to createPlugin
export const createFieldPlugin: CreateFieldPlugin = (onUpdateState) => {
  const params = pluginUrlParamsFromUrl(window.location.search)
  const isEmbedded = window.parent !== window

  if (!params || !isEmbedded) {
    // TODO better error type
    return [undefined, undefined]
  }

  const postToContainer = (message: unknown) => {
    // TODO specify https://app.storyblok.com/ in production mode, * in dev mode
    const origin = '*'
    window.parent.postMessage(message, origin)
  }

  // TODO option to opt out from auto resizer
  const cleanupAutoResizeSideEffects = createAutoResizer(
    params.uid,
    postToContainer,
  )

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const [actions, cleanupPluginClientSideEffects] = createPluginActions(
    params.uid,
    postToContainer,
    onUpdateState,
  )

  const cleanup = () => {
    cleanupPluginClientSideEffects()
    cleanupAutoResizeSideEffects()
    cleanupStyleSideEffects()
  }

  return [actions, cleanup]
}
