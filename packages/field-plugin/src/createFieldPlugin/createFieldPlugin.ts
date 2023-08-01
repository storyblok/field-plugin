import { createPluginActions } from './createPluginActions'
import { createAutoResizer } from './createAutoResizer'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginLoadedMessage, pluginUrlParamsFromUrl } from '../messaging'
import { FieldPluginResponse } from './FieldPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'
import { sandboxUrl } from './sandboxUrl'

/**
 * @returns cleanup function for side effects
 */
export const createFieldPlugin = <Content>(
  onUpdateState: (state: FieldPluginResponse<Content>) => void,
  parseContent: (content: unknown) => Content,
): (() => void) => {
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

  const cleanupAutoResizeSideEffects = createAutoResizer(uid, postToContainer)

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const { actions, messageCallbacks } = createPluginActions({
    uid,
    postToContainer,
    onUpdateState: (data) => {
      onUpdateState({
        type: 'loaded',
        data,
        actions,
      })
    },
    parseContent,
  })

  // Request the initial state from the Visual Editor.
  postToContainer(pluginLoadedMessage(uid))

  const cleanupMessageListenerSideEffects = createPluginMessageListener(
    params.uid,
    messageCallbacks,
  )

  return () => {
    cleanupMessageListenerSideEffects()
    cleanupAutoResizeSideEffects()
    cleanupStyleSideEffects()
  }
}
