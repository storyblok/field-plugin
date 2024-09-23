/* eslint-disable functional/no-let */
import { PluginMessageCallbacks } from './createPluginMessageListener'
import { FieldPluginData } from '../FieldPluginData'
import {
  assetFromAssetSelectedMessage,
  assetModalChangeMessage,
  getContextMessage,
  heightChangeMessage,
  modalChangeMessage,
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnLoadedMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  pluginLoadedMessage,
  valueChangeMessage,
} from '../../messaging'
import { FieldPluginActions, Initialize } from '../FieldPluginActions'
import { pluginStateFromStateChangeMessage } from './partialPluginStateFromStateChangeMessage'
import { callbackQueue } from './callbackQueue'

export type ValidateContent<Content> = (content: unknown) => {
  content: Content
  error?: string
}

export type CreatePluginActions = <Content>(options: {
  uid: string
  postToContainer: (message: unknown) => void
  onUpdateState: (state: FieldPluginData<Content>) => void
  validateContent: ValidateContent<Content>
}) => {
  // These functions are to be called by the field plugin when the user performs actions in the UI
  actions: FieldPluginActions<Content>
  // These functions are called when the plugin receives messages from the container
  messageCallbacks: PluginMessageCallbacks
  // This function is called whenever the height changes
  onHeightChange: (height: number) => void
  // This function is called whenever the ESC key is pressed
  onKeydownEsc: () => void
  // This initiates the plugin
  initialize: Initialize<Content>
}

export const createPluginActions: CreatePluginActions = ({
  uid,
  postToContainer,
  onUpdateState,
  validateContent,
}) => {
  const { pushCallback, popCallback } = callbackQueue()

  const onStateChange: OnStateChangeMessage = (data) => {
    popCallback('stateChanged', data.callbackId)?.(data)
    onUpdateState(pluginStateFromStateChangeMessage(data, validateContent))
  }
  const onLoaded: OnLoadedMessage = (data) => {
    popCallback('loaded', data.callbackId)?.(data)
    onUpdateState(pluginStateFromStateChangeMessage(data, validateContent))
  }
  const onContextRequest: OnContextRequestMessage = (data) => {
    popCallback('context', data.callbackId)?.(data)
  }
  const onAssetSelect: OnAssetSelectMessage = (data) => {
    popCallback('asset', data.callbackId)?.(data)
  }
  const onUnknownMessage: OnUnknownPluginMessage = (data) => {
    // TODO remove side-effect, making functions in this file pure.
    //  perhaps only show this message in development mode?
    console.debug(
      `Plugin received a message from container of an unknown action type "${data.action
      }". You may need to upgrade the version of the @storyblok/field-plugin library. Full message: ${JSON.stringify(
        data,
      )}`,
    )
  }

  const messageCallbacks: PluginMessageCallbacks = {
    onStateChange,
    onLoaded,
    onContextRequest,
    onAssetSelect,
    onUnknownMessage,
  }

  const onHeightChange = (height: number) => {
    postToContainer(heightChangeMessage(uid, height))
  }

  const onKeydownEsc = () => {
    postToContainer(modalChangeMessage({ uid, status: false }))
  }

  return {
    actions: {
      setContent: (content) => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('stateChanged', (message) =>
            resolve(
              pluginStateFromStateChangeMessage(message, validateContent),
            ),
          )
          postToContainer(
            valueChangeMessage({ uid, callbackId, model: content }),
          )
        })
      },
      setModalOpen: (isModalOpen) => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('stateChanged', (message) =>
            resolve(
              pluginStateFromStateChangeMessage(message, validateContent),
            ),
          )
          postToContainer(
            modalChangeMessage({ uid, callbackId, status: isModalOpen }),
          )
        })
      },
      selectAsset: () => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('asset', (message) =>
            resolve(assetFromAssetSelectedMessage(message)),
          )
          postToContainer(assetModalChangeMessage({ uid, callbackId }))
        })
      },
      requestContext: () => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('context', (message) =>
            resolve(message.story),
          )
          postToContainer(getContextMessage({ uid, callbackId }))
        })
      },
    },
    messageCallbacks,
    onHeightChange,
    onKeydownEsc,
    initialize: () => {
      return new Promise((resolve) => {
        const callbackId = pushCallback('loaded', (message) =>
          resolve(pluginStateFromStateChangeMessage(message, validateContent)),
        )
        // Request the initial state from the Visual Editor.
        postToContainer(pluginLoadedMessage({ uid, callbackId }))
      })
    },
  }
}
