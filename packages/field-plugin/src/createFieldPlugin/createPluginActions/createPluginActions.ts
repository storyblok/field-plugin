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
import { FieldPluginActions, SetStateAction } from '../FieldPluginActions'
import {
  partialPluginStateFromContextRequestMessage,
  partialPluginStateFromStateChangeMessage,
} from './partialPluginStateFromStateChangeMessage'

// TODO get rid of this default state
export const defaultState = <Content>(
  defaultContent: Content,
): FieldPluginData<Content> => ({
  isModalOpen: false,
  content: defaultContent,
  options: {},
  storyLang: 'default',
  story: { content: {} },
  blockUid: undefined,
  storyId: undefined,
  token: undefined,
  uid: '-preview',
  spaceId: undefined,
})

export type CreatePluginActionsOptions<Content> = {
  uid: string
  postToContainer: (message: unknown) => void
  onUpdateState: (state: FieldPluginData<Content>) => void
  parseContent: (content: unknown) => Content
}

export const createPluginActions = <Content>(
  options: CreatePluginActionsOptions<Content>,
): {
  // These functions are to be called by the field plugin when the user performs actions in the UI
  actions: FieldPluginActions<Content>
  // These functions are called when the plugin receives messages from the container
  messageCallbacks: PluginMessageCallbacks
} => {
  const { uid, postToContainer, onUpdateState, parseContent } = options
  // Tracks the full state of the plugin.
  //  Because the container doesn't send the full state in its messages, we need to track it ourselves.
  //  isModal and height is not included in the messages to the children and must thus be tracked here.
  //  In future improved versions of the plugin API, this should not be needed.
  let state: FieldPluginData<Content> = defaultState(parseContent(undefined))

  let assetSelectedCallbackRef: undefined | ((filename: Asset) => void) =
    undefined

  const onStateChange: OnStateChangeMessage = (data) => {
    state = {
      ...state,
      ...partialPluginStateFromStateChangeMessage(data, parseContent),
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
        const content: Content = isFunction(action)
          ? action(state.content)
          : action
        postToContainer(valueChangeMessage(uid, content))
        state = {
          ...state,
          content,
        }
        onUpdateState(state)
      },
      setModalOpen: (action) => {
        const isModalOpen = isFunction(action)
          ? action(state.isModalOpen)
          : action
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

/**
 * If we know that setStateAction is a SetStateAction, we can safely check the type with typeof setStateAction === 'function'.
 * But typescript's does not manage to infer the type after such a check, thus we extract that logic into this utility function.
 * @param setStateAction
 */
const isFunction = <T>(
  setStateAction: SetStateAction<T>,
): setStateAction is (state: T) => T => typeof setStateAction === 'function'
