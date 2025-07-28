import { createPluginActions, ValidateContent } from './createPluginActions'
import { createHeightChangeListener } from './createHeightChangeListener'
import { createKeydownEscListener } from './createKeydownEscListener'
import { disableDefaultStoryblokStyles } from './disableDefaultStoryblokStyles'
import { pluginUrlParamsFromUrl } from '../messaging'
import { FieldPluginResponse } from './FieldPluginResponse'
import { createPluginMessageListener } from './createPluginActions/createPluginMessageListener'
import { sandboxUrl } from './sandboxUrl'
import { isCloneable } from '../utils/isCloneable'

export type CreateFieldPluginOptions<Content> = {
  onUpdateState: (state: FieldPluginResponse<Content>) => void
  validateContent?: ValidateContent<Content>
  targetOrigin?: string
  enablePortalModal?: boolean
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
  targetOrigin,
  enablePortalModal,
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

  const { uid, host } = params

  // ToDo: In development we need to load localhost:3300
  // const origin = 'http://localhost:7070'
  // const origin = 'http://localhost:3300'

  const origin =
    typeof targetOrigin === 'string'
      ? targetOrigin
      : host === 'plugin-sandbox.storyblok.com'
        ? 'https://plugin-sandbox.storyblok.com'
        : 'https://app.storyblok.com'

  const postToContainer = (message: unknown) => {
    try {
      window.parent.postMessage(message, origin)
    } catch (err) {
      if (isCloneable(message)) {
        throw err
      }

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

  const {
    actions,
    messageCallbacks,
    onHeightChange,
    onKeydownEsc,
    initialize,
  } = createPluginActions<InferredContent>({
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
    enablePortalModal,
  })

  const cleanupHeightChangeListener = createHeightChangeListener(onHeightChange)

  const cleanupKeydownEscListener = createKeydownEscListener(onKeydownEsc)

  const cleanupMessageListenerSideEffects = createPluginMessageListener(
    params.uid,
    origin,
    messageCallbacks,
  )

  void initialize()

  return () => {
    cleanupMessageListenerSideEffects()
    cleanupHeightChangeListener()
    cleanupKeydownEscListener()
    cleanupStyleSideEffects()
  }
}
