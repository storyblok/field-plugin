import {
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnLoadedMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
} from '../../../messaging'
import { handlePluginMessage } from './handlePluginMessage'

export type PluginMessageCallbacks = {
  onStateChange: OnStateChangeMessage
  onLoaded: OnLoadedMessage
  onContextRequest: OnContextRequestMessage
  onAssetSelect: OnAssetSelectMessage
  onUnknownMessage: OnUnknownPluginMessage
}

export type CreatePluginMessageListener = (
  uid: string,
  callbacks: PluginMessageCallbacks,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  uid,
  callbacks,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    handlePluginMessage(event.data, uid, callbacks)
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
