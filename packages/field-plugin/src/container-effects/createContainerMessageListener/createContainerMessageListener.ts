import {
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isPluginToWrapperMessage,
  isValueChangeMessage,
} from '../../plugin-api/pluginMessage'
import {
  OnGetContext,
  OnPluginReady,
  SetHeight,
  SetModalOpen,
  SetValue,
} from '../../actions'

export type CreateContainerListener = (
  eventHandlers: {
    onHeightChange: SetHeight
    onValueChange: SetValue
    onSetModal: SetModalOpen
    onLoaded: OnPluginReady
    onGetContext: OnGetContext
  },
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
      eventHandlers.onValueChange(message.model)
    }
    if (isPluginLoadedMessage(message)) {
      eventHandlers.onLoaded()
    }
    if (isModalChangeMessage(message)) {
      eventHandlers.onSetModal(message.status)
    }
    if (isHeightChangeMessage(message)) {
      eventHandlers.onHeightChange(message.height)
    }
  }

  options.window.addEventListener('message', handleMessage, false)
  return () => {
    options.window.removeEventListener('message', handleMessage, false)
  }
}
