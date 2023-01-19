import { createPluginMessageListener } from './createPluginMessageListener'
import {
  postPluginLoadedToContainer,
  postIsModalOpenToContainer,
  postValueToContainer,
  postHeightToContainer,
} from './post-to-container'
import { PluginClient } from './PluginClient'
import { PluginState } from './PluginState'
import { partialPluginStateFromMessage } from './createPluginMessageListener/partialPluginStateFromMessage'
import { OnMessageToPlugin } from '../plugin-api/types'

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

export type CreatePluginClient = (
  onUpdateState: (state: PluginState) => void,
) => [PluginClient, () => void]

export const createPluginClient: CreatePluginClient = (onUpdateState) => {
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
  postPluginLoadedToContainer() // Receive the current value
  return [
    {
      setHeight: (height) => {
        postHeightToContainer(height)
        state = {
          ...state,
          height,
        }
        onUpdateState(state)
      },
      setValue: (value) => {
        postValueToContainer(value)
        state = {
          ...state,
          value,
        }
        // TODO request new value from parent
        onUpdateState(state)
      },
      setModalOpen: (isModalOpen) => {
        postIsModalOpenToContainer(isModalOpen)
        state = {
          ...state,
          isModalOpen,
        }
        onUpdateState(state)
      },
    },
    cleanupEventListener,
  ]
}
