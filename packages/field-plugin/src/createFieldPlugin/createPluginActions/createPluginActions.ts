/* eslint-disable functional/no-let */
import { PluginMessageCallbacks } from './createPluginMessageListener'
import { FieldPluginData } from '../FieldPluginData'
import {
  Asset,
  assetFromAssetSelectedMessage,
  assetModalChangeMessage,
  getContextMessage,
  modalChangeMessage,
  OnAssetSelectMessage,
  OnContextRequestMessage,
  OnStateChangeMessage,
  OnUnknownPluginMessage,
  valueChangeMessage,
} from '../../messaging'
import { FieldPluginActions } from '../FieldPluginActions'
import {
  partialPluginStateFromContextRequestMessage,
  partialPluginStateFromStateChangeMessage,
} from './partialPluginStateFromStateChangeMessage'

// TODO get rid of this default state
export const defaultState: FieldPluginData = {
  isModalOpen: false,
  content: undefined,
  options: {},
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
  let state: FieldPluginData = defaultState

  let assetSelectedCallbackRef: undefined | ((filename: Asset) => void) =
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
    assetSelectedCallbackRef?.(assetFromAssetSelectedMessage(data))
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

  return {
    actions: {
      setContent: (action) => {
        const content: unknown =
          typeof action === 'function' ? action(state.content) : action
        postToContainer(valueChangeMessage(uid, content))
        state = {
          ...state,
          content,
        }
        onUpdateState(state)
      },
      setModalOpen: (action) => {
        const isModalOpen: boolean =
          typeof action === 'function' ? action(state.isModalOpen) : action
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
      requestContext: () => postToContainer(getContextMessage(uid)),
    },
    messageCallbacks,
  }
}
