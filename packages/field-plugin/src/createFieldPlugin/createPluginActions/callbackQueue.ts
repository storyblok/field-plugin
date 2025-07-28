import type {
  PromptAIResponseMessage,
  AssetSelectedMessage,
  ContextRequestMessage,
  UserContextRequestMessage,
  LoadedMessage,
  OnMessage,
  StateChangedMessage,
  PreviewDimensionResponseMessage,
} from '../../messaging'
import { getRandomUid } from '../../utils'

export type CallbackId = string

type CallbackMap = {
  asset: Record<CallbackId, OnMessage<AssetSelectedMessage>>
  context: Record<CallbackId, OnMessage<ContextRequestMessage>>
  userContext: Record<CallbackId, OnMessage<UserContextRequestMessage>>
  stateChanged: Record<CallbackId, OnMessage<StateChangedMessage>>
  loaded: Record<CallbackId, OnMessage<LoadedMessage>>
  promptAI: Record<CallbackId, OnMessage<PromptAIResponseMessage>>
  previewDimension: Record<
    CallbackId,
    OnMessage<PreviewDimensionResponseMessage>
  >
}
type CallbackType = keyof CallbackMap

export const callbackQueue = () => {
  let callbackMap: CallbackMap = {
    asset: {},
    context: {},
    userContext: {},
    stateChanged: {},
    loaded: {},
    promptAI: {},
    previewDimension: {},
  }

  const pushCallback = <T extends CallbackType>(
    callbackType: T,
    callback: CallbackMap[T][CallbackId],
  ): CallbackId => {
    const callbackId = getRandomUid()
    callbackMap = {
      ...callbackMap,
      [callbackType]: {
        ...callbackMap[callbackType],
        [callbackId]: callback,
      },
    }
    return callbackId
  }
  const popCallback = <T extends CallbackType>(
    callbackType: T,
    callbackId: CallbackId | undefined,
  ): CallbackMap[T][CallbackId] | undefined => {
    if (typeof callbackId === 'undefined') {
      return undefined
    }
    const callback = callbackMap[callbackType][callbackId]
    const without = Object.entries(callbackMap[callbackType]).reduce(
      (previousValue, [id, callback]) => {
        if (id === callbackId) {
          return previousValue
        }
        // @ts-expect-error hard to fix
        previousValue[id] = callback
        return previousValue
      },
      {} as CallbackMap[T][CallbackId],
    )
    callbackMap = {
      ...callbackMap,
      [callbackType]: without,
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return callback
  }
  return {
    pushCallback,
    popCallback,
  }
}
