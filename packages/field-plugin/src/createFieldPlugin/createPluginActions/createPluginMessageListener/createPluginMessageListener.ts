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
  origin: string,
  allowAllOrigins: boolean,
  callbacks: PluginMessageCallbacks,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  uid,
  origin,
  allowAllOrigins,
  callbacks,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    if (allowAllOrigins || event.origin === origin) {
      handlePluginMessage(event.data, uid, callbacks)
    }
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
