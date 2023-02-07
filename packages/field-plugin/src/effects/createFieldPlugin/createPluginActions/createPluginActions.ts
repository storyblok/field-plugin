/* eslint-disable functional/no-let */
import { createPluginMessageListener } from './createPluginMessageListener'
import { PluginState } from '../../PluginState'
import { partialPluginStateFromMessage } from './createPluginMessageListener/partialPluginStateFromMessage'
import {
  OnAssetSelectedMessage,
  OnStateChangedMessage,
} from '../../../plugin-api'
import {
  PluginActions,
  postRequestContext,
  postSetHeight,
  postSetModalOpen,
  postSetPluginReady,
  postSetValue,
} from '../../../actions'
import { postSetAssetModalOpen } from '../../../actions'

// TODO get rid of this default state
export const defaultState: PluginState = {
  height: 0,
  isModalOpen: false,
  value: undefined,
  options: {},
  language: undefined,
  blockId: undefined,
  story: undefined,
  storyId: undefined,
  token: undefined,
  uid: '-preview',
  spaceId: undefined,
}

export type CreatePluginActions = (
  onUpdateState: (state: PluginState) => void,
) => [PluginActions, () => void]

// eslint-disable-next-line functional/no-mixed-type
type CallbackRef = {
  // using field as sort of uid
  uid: string
  callback: (filename: string) => void
}

export const createPluginActions: CreatePluginActions = (onUpdateState) => {
  // Tracks the full state of the plugin.
  //  Because the container doesn't send the full state in its messages, we need to track it ourselves.
  //  isModal and height is not included in the messages to the children and must thus be tracked here.
  //  In future improved versions of the plugin API, this should not be needed.
  let state: PluginState = defaultState

  let assetSelectedCallbackRef: CallbackRef | undefined = undefined

  const onStateChange: OnStateChangedMessage = (data) => {
    state = {
      ...state,
      ...partialPluginStateFromMessage(data),
    }
    onUpdateState(state)
  }
  const onAssetSelected: OnAssetSelectedMessage = (data) => {
    if (!assetSelectedCallbackRef) {
      return
    }
    if (assetSelectedCallbackRef.uid === data.field) {
      assetSelectedCallbackRef.callback(data.filename)
    }
  }

  const cleanupEventListener = createPluginMessageListener(
    onStateChange,
    onAssetSelected,
  )

  // Receive the current value
  postSetPluginReady()
  return [
    {
      setHeight: (height) => {
        postSetHeight(height)
        state = {
          ...state,
          height,
        }
        onUpdateState(state)
      },
      setValue: (value) => {
        postSetValue(value)
        state = {
          ...state,
          value,
        }
        // TODO request new value from parent
        onUpdateState(state)
      },
      setModalOpen: (isModalOpen) => {
        postSetModalOpen(isModalOpen)
        state = {
          ...state,
          isModalOpen,
        }
        onUpdateState(state)
      },
      setAssetModalOpen: (callback) => {
        const uid = Math.random().toString(32).slice(2, 10)
        assetSelectedCallbackRef = {
          uid,
          callback,
        }
        postSetAssetModalOpen(uid)
      },
      setPluginReady: postSetPluginReady,
      requestContext: postRequestContext,
    },
    cleanupEventListener,
  ]
}
