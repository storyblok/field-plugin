/* eslint-disable functional/no-let */
import { PluginMessageCallbacks } from './createPluginMessageListener'
import { FieldPluginData } from '../FieldPluginData'
import {
  Asset,
  assetFromAssetSelectedMessage,
  assetModalChangeMessage,
  ContextRequestMessage,
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
import {
  partialPluginStateFromContextRequestMessage,
  partialPluginStateFromStateChangeMessage,
} from './partialPluginStateFromStateChangeMessage'
import { getRandomString } from '../../utils'

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
  let state: FieldPluginData = defaultState

  let assetSelectedCallbackRef: undefined | ((filename: Asset) => void) =
    undefined
  let assetSelectedCallbackId: undefined | string = undefined

  let requestContextCallbackRef:
    | undefined
    | ((message: ContextRequestMessage) => void) = undefined
  let requestContextCallbackId: undefined | string = undefined

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

    // We do not reject the promise here.
    // There can be another instance of `createFieldPlugin()`,
    // calling `requestContext` with different `callbackId`.
    // In such case, we should simply ignore the callback.
    // We may get another callback with correct `callbackId`.
    if (data.callbackId === requestContextCallbackId) {
      requestContextCallbackRef?.(data)
      requestContextCallbackId = undefined
      requestContextCallbackRef = undefined
    }
  }
  const onAssetSelect: OnAssetSelectMessage = (data) => {
    // We do not reject the promise here.
    // There can be another instance of `createFieldPlugin()`,
    // calling `selectAsset` with different `callbackId`.
    // In such case, we should simply ignore the callback.
    // We may get another callback with correct `callbackId`.
    if (data.callbackId === assetSelectedCallbackId) {
      assetSelectedCallbackRef?.(assetFromAssetSelectedMessage(data))
      assetSelectedCallbackId = undefined
      assetSelectedCallbackRef = undefined
    }
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
      setContent: (action) => {
        const content: unknown =
          // This is not safe: if the user pass a function to setContent(),
          //  this code assumes that it is an updater function
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          typeof action === 'function' ? action(state.content) : action
        postToContainer(valueChangeMessage(uid, content))
        state = {
          ...state,
          content,
        }
        onUpdateState(state)
      },
      setModalOpen: (action) => {
        const isModalOpen =
          typeof action === 'function' ? action(state.isModalOpen) : action
        postToContainer(modalChangeMessage(uid, isModalOpen))
        state = {
          ...state,
          isModalOpen,
        }
        onUpdateState(state)
      },
      selectAsset: () => {
        if (assetSelectedCallbackId !== undefined) {
          // eslint-disable-next-line functional/no-promise-reject
          return Promise.reject(
            'Please wait until an asset is selected before making another request.',
          )
        }
        const callbackId = getRandomString(16)
        assetSelectedCallbackId = callbackId
        return new Promise((resolve) => {
          assetSelectedCallbackRef = resolve
          postToContainer(assetModalChangeMessage(uid, callbackId))
        })
      },
      requestContext: () => {
        if (requestContextCallbackId !== undefined) {
          // eslint-disable-next-line functional/no-promise-reject
          return Promise.reject(
            'Please wait until a previous requestContext call is resolved.',
          )
        }
        const callbackId = getRandomString(16)
        requestContextCallbackId = callbackId
        return new Promise((resolve) => {
          requestContextCallbackRef = resolve
          postToContainer(getContextMessage(uid, callbackId))
        })
      },
    },
    messageCallbacks,
    onHeightChange,
  }
}
