import type {
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnUserContextRequestMessage,
  OnLoadedMessage,
  OnPromptAIMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  OnPreviewDimensionMessage,
} from '../../../messaging'
import { handlePluginMessage } from './handlePluginMessage'

export type PluginMessageCallbacks = {
  onStateChange: OnStateChangeMessage
  onLoaded: OnLoadedMessage
  onContextRequest: OnContextRequestMessage
  onUserContextRequest: OnUserContextRequestMessage
  onAssetSelect: OnAssetSelectMessage
  onPromptAI: OnPromptAIMessage
  onPreviewDimension: OnPreviewDimensionMessage
  onUnknownMessage: OnUnknownPluginMessage
}

export type CreatePluginMessageListener = (
  uid: string,
  origin: string,
  callbacks: PluginMessageCallbacks,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  uid,
  origin,
  callbacks,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    if (event.origin === origin) {
      handlePluginMessage(event.data, uid, callbacks)
    }
  }

  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
