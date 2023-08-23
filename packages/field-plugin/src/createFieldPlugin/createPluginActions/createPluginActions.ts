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
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  valueChangeMessage,
} from '../../messaging'
import { FieldPluginActions } from '../FieldPluginActions'
import { pluginStateFromStateChangeMessage } from './partialPluginStateFromStateChangeMessage'
import { callbackQueue } from './callbackQueue'

// TODO get rid of this default state
export const defaultState: FieldPluginData = {
  isModalOpen: false,
  content: undefined,
  options: {},
  storyLang: 'default',
  story: { content: {} },
  blockUid: undefined,
  storyId: undefined,
  token: undefined,
  uid: '-preview',
  spaceId: undefined,
}

export type CreatePluginActions = (
  uid: string,
  postToContainer: (message: unknown) => void,
  onUpdateState: (state: FieldPluginData) => void,
) => {
  // These functions are to be called by the field plugin when the user performs actions in the UI
  actions: FieldPluginActions
  // These functions are called when the plugin receives messages from the container
  messageCallbacks: PluginMessageCallbacks
  // This function is called whenever the height changes
  onHeightChange: (height: number) => void
}

export const createPluginActions: CreatePluginActions = (
  uid,
  postToContainer,
  onUpdateState,
) => {
  // Tracks the full state of the plugin.
  //  Because the container doesn't send the full state in its messages, we need to track it ourselves.
  //  isModal and height is not included in the messages to the children and must thus be tracked here.
  //  In future improved versions of the plugin API, this should not be needed.

  const { pushCallback, popCallback } = callbackQueue()

  const onStateChange: OnStateChangeMessage = (data) => {
    popCallback('state', data.callbackId)?.(data)
    console.log(data.model)
    onUpdateState(pluginStateFromStateChangeMessage(data))
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
      `Plugin received a message from container of an unknown action type "${
        data.action
      }". You may need to upgrade the version of the @storyblok/field-plugin library. Full message: ${JSON.stringify(
        data,
      )}`,
    )
  }

  const messageCallbacks: PluginMessageCallbacks = {
    onStateChange,
    onContextRequest,
    onAssetSelect,
    onUnknownMessage,
  }

  const onHeightChange = (height: number) => {
    postToContainer(heightChangeMessage(uid, height))
  }

  return {
    actions: {
      setContent: (content) => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('state', (message) =>
            resolve(pluginStateFromStateChangeMessage(message)),
          )
          postToContainer(
            valueChangeMessage({ uid, callbackId, model: content }),
          )
        })
      },
      setModalOpen: (isModalOpen) => {
        return new Promise((resolve) => {
          const callbackId = pushCallback('state', (message) =>
            resolve(pluginStateFromStateChangeMessage(message)),
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
  }
}
