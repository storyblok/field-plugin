import {
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isPluginToWrapperMessage,
  isValueChangeMessage,
} from '../../plugin-api/pluginMessage'
import { PluginActions } from '../../actions'

export type CreateContainerListener = (
  eventHandlers: PluginActions,
  options: {
    window: Window
    iframeOrigin: string
    uid: string
  },
) => () => void

export const createContainerMessageListener: CreateContainerListener = (
  eventHandlers,
  options,
) => {
  const handleMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== options.iframeOrigin) {
      return
    }
    if (!isPluginToWrapperMessage(event.data)) {
      return
    }
    const message = event.data
    if (message.uid !== options.uid) {
      return
    }

    if (isValueChangeMessage(message)) {
      eventHandlers.setValue(message.model)
    }
    if (isPluginLoadedMessage(message)) {
      eventHandlers.setPluginReady()
    }
    if (isModalChangeMessage(message)) {
      eventHandlers.setModalOpen(message.status)
    }
    if (isHeightChangeMessage(message)) {
      eventHandlers.setHeight(message.height)
    }
  }

  options.window.addEventListener('message', handleMessage, false)
  return () => {
    options.window.removeEventListener('message', handleMessage, false)
  }
}
