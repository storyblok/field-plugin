import {
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnStateChangeMessage,
} from '../../../messaging'
import { handlePluginMessage } from './handlePluginMessage'

export type CreatePluginMessageListener = (
  uid: string,
  onStateChange: OnStateChangeMessage,
  onContextRequest: OnContextRequestMessage,
  onAssetSelected: OnAssetSelectMessage,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  uid,
  onStateChange,
  onContextRequest,
  onAssetSelected,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    handlePluginMessage(
      event,
      uid,
      onStateChange,
      onContextRequest,
      onAssetSelected,
    )
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
