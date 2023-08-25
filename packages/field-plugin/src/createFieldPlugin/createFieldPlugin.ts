import { createPluginActions } from './createPluginActions'
import { createHeightChangeListener } from './createHeightChangeListener'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginLoadedMessage, pluginUrlParamsFromUrl } from '../messaging'
import { FieldPluginResponse } from './FieldPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'
import { sandboxUrl } from './sandboxUrl'
import { isCloneable } from '../utils/isCloneable'

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
      if (isCloneable(message)) {
        // eslint-disable-next-line functional/no-throw-statement
        throw err
      }

      // eslint-disable-next-line functional/no-throw-statement
      throw new Error(
        'The argument could not be cloned. ' +
          'The argument must be cloneable with structuredClone(), so that it can be sent to other windows with window.postMessage(). ' +
          'Does your object contain functions, getters, setters, proxies, or any other value that is not cloneable? Did you try to pass a reactive object? ' +
          'For a full description on the structuredClone algorithm, see: ' +
          'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm',
        {
          cause: err,
        },
      )
    }
  }

  const cleanupStyleSideEffects = disableDefaultStoryblokStyles()

  const { actions, messageCallbacks, onHeightChange } = createPluginActions(
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

  const cleanupHeightChangeListener = createHeightChangeListener(onHeightChange)

  // Request the initial state from the Visual Editor.
  postToContainer(pluginLoadedMessage(uid))

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
