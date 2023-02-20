import {
  OnAssetSelectedMessage,
  OnStateChangedMessage,
} from '../../../plugin-api'
import { handlePluginMessage } from './handlePluginMessage'

export type CreatePluginMessageListener = (
  uid: string,
  onStateChange: OnStateChangedMessage,
  onAssetSelected: OnAssetSelectedMessage,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  uid,
  onStateChange,
  onAssetSelected,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    handlePluginMessage(event, uid, onStateChange, onAssetSelected)
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}
