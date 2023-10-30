import { createPluginActions, ValidateContent } from './createPluginActions'
import { createHeightChangeListener } from './createHeightChangeListener'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginUrlParamsFromUrl } from '../messaging'
import { FieldPluginResponse } from './FieldPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'
import { sandboxUrl } from './sandboxUrl'
import { isCloneable } from '../utils/isCloneable'

export type CreateFieldPluginOptions<Content> = {
  onUpdateState: (state: FieldPluginResponse<Content>) => void
  validateContent?: ValidateContent<Content>
}

export type CreateFieldPlugin = <Content = unknown>(
  options: CreateFieldPluginOptions<Content>,
) => () => void

/**
 * @returns cleanup function for side effects
 */
export const createFieldPlugin: CreateFieldPlugin = ({
  onUpdateState,
  validateContent,
}) => {
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
      console.log('💡 sending post message!', {
        postMessage: window.parent.postMessage.toString(),
        message,
      })
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

  // This is basically the `Content` inferred from the `validateContent`.
  type InferredContent = ReturnType<
    Exclude<typeof validateContent, undefined>
  >['content']

  const { actions, messageCallbacks, onHeightChange, initialize } =
    createPluginActions<InferredContent>({
      uid,
      postToContainer,
      onUpdateState: (data) => {
        onUpdateState({
          type: 'loaded',
          data,
          actions,
        })
      },
      validateContent:
        validateContent ||
        ((content) => ({ content: content as InferredContent })),
    })

  const cleanupHeightChangeListener = createHeightChangeListener(onHeightChange)

  const cleanupMessageListenerSideEffects = createPluginMessageListener(
    params.uid,
    messageCallbacks,
  )

  console.log('💡 initialize')
  void initialize()

  return () => {
    cleanupMessageListenerSideEffects()
    cleanupHeightChangeListener()
    cleanupStyleSideEffects()
  }
}
