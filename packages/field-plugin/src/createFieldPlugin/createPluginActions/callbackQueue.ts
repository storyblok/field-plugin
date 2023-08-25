import {
  AssetSelectedMessage,
  ContextRequestMessage,
  LoadedMessage,
  OnMessage,
  StateChangedMessage,
} from '../../messaging'

export type CallbackId = string

type CallbackMap = {
  asset: Record<CallbackId, OnMessage<AssetSelectedMessage>>
  context: Record<CallbackId, OnMessage<ContextRequestMessage>>
  stateChanged: Record<CallbackId, OnMessage<StateChangedMessage>>
  loaded: Record<CallbackId, OnMessage<LoadedMessage>>
}
type CallbackType = keyof CallbackMap

export const callbackQueue = () => {
  // eslint-disable-next-line functional/no-let
  let callbackMap: CallbackMap = {
    asset: {},
    context: {},
    stateChanged: {},
    loaded: {},
  }
  const pushCallback = <T extends CallbackType>(
    callbackType: T,
    callback: CallbackMap[T][CallbackId],
  ): CallbackId => {
    const callbackId = randomUid()
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,functional/immutable-data
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

const random8 = () =>
  Math.random()
    .toString(16)
    .slice(2, 2 + 8)

const randomUid = (): CallbackId => new Array(4).fill(0).map(random8).join('-')
