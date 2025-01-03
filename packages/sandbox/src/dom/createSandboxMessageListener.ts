import {
  isAssetModalChangeMessage,
  isGetContextMessage,
  isHeightChangeMessage,
  isMessageToContainer,
  isModalChangeMessage,
  isPluginLoadedMessage,
  isValueChangeMessage,
  type ModalChangeMessage,
  type PluginLoadedMessage,
  type PluginPromptAIMessage,
  type ValueChangeMessage,
  type AssetModalChangeMessage,
  type GetContextMessage,
  type HeightChangeMessage,
  isPluginPromptAIMessage,
} from '@storyblok/field-plugin'

type SandboxActions = {
  setHeight: (message: HeightChangeMessage) => void
  setContent: (message: ValueChangeMessage) => void
  setModalOpen: (message: ModalChangeMessage) => void
  setPluginReady: (message: PluginLoadedMessage) => void
  requestContext: (message: GetContextMessage) => void
  selectAsset: (message: AssetModalChangeMessage) => void
  promptAI: (message: PluginPromptAIMessage) => void
}

export type CreateSandboxListener = (
  eventHandlers: SandboxActions,
  options: {
    window: Window
    iframeOrigin: string | undefined
    uid: string
  },
) => () => void

export const createSandboxMessageListener: CreateSandboxListener = (
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
    } else if (isPluginPromptAIMessage(message)) {
      eventHandlers.promptAI(message)
    } else {
      console.warn(
        `The Sandbox received unknown message from plugin: ${JSON.stringify(
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
