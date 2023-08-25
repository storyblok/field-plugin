import { createPluginActions } from './createPluginActions'
import { createHeightChangeListener } from './createHeightChangeListener'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginLoadedMessage, pluginUrlParamsFromUrl } from '../messaging'
import { FieldPluginResponse } from './FieldPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'
import { sandboxUrl } from './sandboxUrl'

export type CreateFieldPlugin = (
  onUpdate: (state: FieldPluginResponse) => void,
) => () => void

/**
 * @returns cleanup function for side effects
 */
export const createFieldPlugin: CreateFieldPlugin = (onUpdateState) => {
  const isEmbedded = window.parent !== window

  if (!isEmbedded) {
    onUpdateState({
      type: 'error',
      error: new Error(
        `The window is not embedded within another window. Did you mean to open the field plugin in the sandbox? ${sandboxUrl()}`,
      ),
    })
    return () => undefined
  }

  const params = pluginUrlParamsFromUrl(window.location.search)

  if (!params) {
    onUpdateState({
      type: 'error',
      error: new Error(
        `The URL parameters does not match the expected format.`,
      ),
    })
    return () => undefined
  }

  const { uid } = params

  const postToContainer = (message: unknown) => {
    // TODO specify https://app.storyblok.com/ in production mode, * in dev mode
    const origin = '*'
    window.parent.postMessage(message, origin)
  }

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const { actions, messageCallbacks, onHeightChange, setLoaded } =
    createPluginActions(uid, postToContainer, (data) => {
      onUpdateState({
        type: 'loaded',
        data,
        actions,
      })
    })

  const cleanupHeightChangeListener = createHeightChangeListener(onHeightChange)

  void setLoaded().then((data) => {
    onUpdateState({
      type: 'loaded',
      data,
      actions,
    })
  })

  const cleanupMessageListenerSideEffects = createPluginMessageListener(
    params.uid,
    messageCallbacks,
  )

  return () => {
    cleanupMessageListenerSideEffects()
    cleanupHeightChangeListener()
    cleanupStyleSideEffects()
  }
}
