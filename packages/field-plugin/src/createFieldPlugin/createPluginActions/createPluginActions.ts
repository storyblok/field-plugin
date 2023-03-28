/* eslint-disable functional/no-let */
import { PluginMessageCallbacks } from './createPluginMessageListener'
import { PluginState } from '../PluginState'
import {
  assetModalChangeMessage,
  getContextMessage,
  heightChangeMessage,
  modalChangeMessage,
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  pluginLoadedMessage,
  valueChangeMessage,
} from '../../messaging'
import { PluginActions } from '../PluginActions'
import {
  partialPluginStateFromContextRequestMessage,
  partialPluginStateFromStateChangeMessage,
} from './partialPluginStateFromStateChangeMessage'

// TODO get rid of this default state
export const defaultState: PluginState = {
  height: 0,
  isModalOpen: false,
  value: undefined,
  options: {},
  language: undefined,
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
  onUpdateState: (state: PluginState) => void,
) => {
  // These functions are to be called by the field plugin when the user performs actions in the UI
  actions: PluginActions
  // These functions are called when the plugin receives messages from the container
  messageCallbacks: PluginMessageCallbacks
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
  let state: PluginState = defaultState

  let assetSelectedCallbackRef: undefined | ((filename: string) => void) =
    undefined

  const onStateChange: OnStateChangeMessage = (data) => {
    state = {
      ...state,
      ...partialPluginStateFromStateChangeMessage(data),
    }
    onUpdateState(state)
  }
  const onContextRequest: OnContextRequestMessage = (data) => {
    state = {
      ...state,
      ...partialPluginStateFromContextRequestMessage(data),
    }
    onUpdateState(state)
  }
  const onAssetSelect: OnAssetSelectMessage = (data) => {
    assetSelectedCallbackRef?.(data.filename)
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

  // Receive the current value
  const setPluginReady = () => postToContainer(pluginLoadedMessage(uid))
  return {
    actions: {
      setHeight: (height) => {
        postToContainer(heightChangeMessage(uid, height))
        state = {
          ...state,
          height,
        }
        onUpdateState(state)
      },
      setValue: (value) => {
        postToContainer(valueChangeMessage(uid, value))
        state = {
          ...state,
          value,
        }
        // TODO request new value from parent
        onUpdateState(state)
      },
      setModalOpen: (isModalOpen) => {
        postToContainer(modalChangeMessage(uid, isModalOpen))
        state = {
          ...state,
          isModalOpen,
        }
        onUpdateState(state)
      },
      selectAsset: () => {
        return new Promise((resolve) => {
          assetSelectedCallbackRef = resolve
          postToContainer(assetModalChangeMessage(uid))
        })
      },
      setPluginReady,
      requestContext: () => postToContainer(getContextMessage(uid)),
    },
    messageCallbacks,
  }
}
