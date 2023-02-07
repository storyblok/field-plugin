import { createPluginMessageListener } from './createPluginMessageListener'
import { PluginState } from '../../PluginState'
import { partialPluginStateFromMessage } from './createPluginMessageListener/partialPluginStateFromMessage'
import { OnMessageToPlugin } from '../../../plugin-api'
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

export const createPluginActions: CreatePluginActions = (onUpdateState) => {
  // Tracks the full state of the plugin.
  //  Because the container doesn't send the full state in its messages, we need to track it ourselves.
  //  isModal and height is not included in the messages to the children and must thus be tracked here.
  //  In future improved versions of the plugin API, this should not be needed.
  // eslint-disable-next-line functional/no-let
  let state: PluginState = defaultState
  const onMessage: OnMessageToPlugin = (data) => {
    state = {
      ...state,
      ...partialPluginStateFromMessage(data),
    }
    onUpdateState(state)
  }
  const cleanupEventListener = createPluginMessageListener(onMessage)
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
      setAssetModalOpen: postSetAssetModalOpen,
      setPluginReady: postSetPluginReady,
      requestContext: postRequestContext,
    },
    cleanupEventListener,
  ]
}
