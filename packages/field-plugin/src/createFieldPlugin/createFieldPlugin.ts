import { createPluginActions } from './createPluginActions'
import { createAutoResizer } from './createAutoResizer'
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
    try {
      // TODO specify https://app.storyblok.com/ in production mode, * in dev mode
      const origin = '*'
      window.parent.postMessage(message, origin)
    } catch (err) {
      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        `
          It seems your message couldn't be serialized correctly by the 'structureClone()' function
          used when sending messages thru 'windows.postMessage()'. 
          Please check if your message is following the right specification here: 
          https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
        `,
        {
          cause: err,
        },
      )
    }
  }

  const cleanupAutoResizeSideEffects = createAutoResizer(uid, postToContainer)

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const { actions, messageCallbacks } = createPluginActions(
    uid,
    postToContainer,
    (data) => {
      onUpdateState({
        type: 'loaded',
        data,
        actions,
      })
    },
  )

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
