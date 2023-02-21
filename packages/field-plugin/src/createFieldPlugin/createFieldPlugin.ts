import { PluginState } from './PluginState'
import { createPluginActions } from './createPluginActions'
import { createAutoResizer } from './createAutoResizer'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginUrlParamsFromUrl } from '../plugin-api'
import { PluginActions } from './PluginActions'

export type CreateFieldPlugin = (
  onUpdate: (state: PluginResult) => void,
) => () => void

export type PluginResult =
  | {
      isLoading: true
      error?: never
      data?: never
      actions?: never
    }
  | {
      isLoading: false
      error: Error
      data?: never
      actions?: never
    }
  | {
      isLoading: false
      error?: never
      data: PluginState
      actions: PluginActions
    }

/**
 * @returns cleanup function for side effects
 */
export const createFieldPlugin: CreateFieldPlugin = (onUpdateState) => {
  const isEmbedded = window.parent !== window

  if (!isEmbedded) {
    onUpdateState({
      error: new Error(`The window is not embedded within another window`),
      isLoading: false,
    })
    return () => undefined
  }

  const params = pluginUrlParamsFromUrl(window.location.search)

  if (!params) {
    onUpdateState({
      error: new Error(
        `The URL parameters does not match the expected format.`,
      ),
      isLoading: false,
    })
    return () => undefined
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
    (data) => {
      onUpdateState({
        isLoading: false,
        data,
        actions,
      })
    },
  )

  const cleanupSideEffects = () => {
    cleanupPluginClientSideEffects()
    cleanupAutoResizeSideEffects()
    cleanupStyleSideEffects()
  }

  return cleanupSideEffects
}
