import {
  isHeightChangeMessage,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isMessageToContainer,
  isValueChangeMessage,
  isAssetModalChangeMessage,
  RequestContext,
  SetHeight,
  SetModalOpen,
  SetPluginReady,
  SetValue,
  isGetContextMessage,
} from '@storyblok/field-plugin'

type ContainerActions = {
  setHeight: SetHeight
  setValue: SetValue
  setModalOpen: SetModalOpen
  setPluginReady: SetPluginReady
  requestContext: RequestContext
  selectAsset: (field: string) => void
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
      eventHandlers.setValue(message.model)
    } else if (isPluginLoadedMessage(message)) {
      eventHandlers.setPluginReady()
    } else if (isModalChangeMessage(message)) {
      eventHandlers.setModalOpen(message.status)
    } else if (isHeightChangeMessage(message)) {
      eventHandlers.setHeight(message.height)
    } else if (isAssetModalChangeMessage(message)) {
      eventHandlers.selectAsset(message.field ?? '')
    } else if (isGetContextMessage(message)) {
      eventHandlers.requestContext()
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
