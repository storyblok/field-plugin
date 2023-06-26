import {
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
} from '../../../messaging'
import { handlePluginMessage } from './handlePluginMessage'
import {
  partialPluginStateFromContextRequestMessage,
  partialPluginStateFromStateChangeMessage,
} from '../partialPluginStateFromStateChangeMessage'
import { FieldPluginData } from '../../FieldPluginData'

export type PluginMessageCallbacks = {
  onStateChange: OnStateChangeMessage
  onContextRequest: OnContextRequestMessage
  onAssetSelect: OnAssetSelectMessage
  onUnknownMessage: OnUnknownPluginMessage
}

export type CreatePluginMessageListener = (
  callbacks: PluginMessageCallbacks,
) => () => void

/**
 * Has side effects!
 * Returns a cleanup function that unregisters effects.
 */
export const createPluginMessageListener: CreatePluginMessageListener = (
  callbacks,
) => {
  const handleEvent = (event: MessageEvent<unknown>) => {
    handlePluginMessage(event.data, callbacks)
  }
  window.addEventListener('message', handleEvent, false)

  return () => {
    window.removeEventListener('message', handleEvent, false)
  }
}

export type CreatePluginDataListener = (
  onUpdate: (data: Partial<FieldPluginData>) => void,
) => () => void
export const createPluginDataListener: CreatePluginDataListener = (
  onUpdate,
) => {
  return createPluginMessageListener({
    onStateChange: (message) =>
      onUpdate(partialPluginStateFromStateChangeMessage(message)),
    onContextRequest: (message) =>
      onUpdate(partialPluginStateFromContextRequestMessage(message)),
    onAssetSelect: () => undefined,
    onUnknownMessage: () => console.error('unknown message type'),
  })
}
