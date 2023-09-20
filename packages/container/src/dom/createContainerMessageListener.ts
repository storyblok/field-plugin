import {
  AssetModalChangeMessage,
  GetContextMessage,
  HeightChangeMessage,
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isMessageToContainer,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
  ModalChangeMessage,
  PluginLoadedMessage,
  ValueChangeMessage,
} from '@storyblok/field-plugin'

type ContainerActions = {
  setHeight: (message: HeightChangeMessage) => void
  setContent: (message: ValueChangeMessage) => void
  setModalOpen: (message: ModalChangeMessage) => void
  setPluginReady: (message: PluginLoadedMessage) => void
  requestContext: (message: GetContextMessage) => void
  selectAsset: (message: AssetModalChangeMessage) => void
}

export type CreateContainerListener = (
  eventHandlers: ContainerActions,
  options: {
    window: Window
    iframeOrigin: string | undefined
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
    if (!isMessageToContainer(event.data)) {
      return
    }
    const message = event.data
    if (message.uid !== options.uid) {
      return
    }

    if (isValueChangeMessage(message)) {
      eventHandlers.setContent(message)
    } else if (isPluginLoadedMessage(message)) {
      eventHandlers.setPluginReady(message)
    } else if (isModalChangeMessage(message)) {
      eventHandlers.setModalOpen(message)
    } else if (isHeightChangeMessage(message)) {
      eventHandlers.setHeight(message)
    } else if (isAssetModalChangeMessage(message)) {
      eventHandlers.selectAsset(message)
    } else if (isGetContextMessage(message)) {
      eventHandlers.requestContext(message)
    } else {
      console.warn(
        `Container received unknown message from plugin: ${JSON.stringify(
          message,
        )}`,
      )
    }
  }

  options.window.addEventListener('message', handleMessage, false)
  return () => {
    options.window.removeEventListener('message', handleMessage, false)
  }
}
