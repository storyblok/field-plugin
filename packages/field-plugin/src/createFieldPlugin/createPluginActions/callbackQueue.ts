import {
  AssetSelectedMessage,
  ContextRequestMessage,
  OnMessage,
  LoadedMessage,
  StateChangedMessage,
} from '../../messaging'

type CallbackId = string
type CallbackRef<Message> = {
  callbackId: CallbackId
  callback: OnMessage<Message>
}
type CallbackMap = {
  asset: CallbackRef<AssetSelectedMessage>[]
  context: CallbackRef<ContextRequestMessage>[]
  stateChanged: CallbackRef<StateChangedMessage>[]
  loaded: CallbackRef<LoadedMessage>[]
}
type CallbackType = keyof CallbackMap

export const callbackQueue = (maxQueueLength: number) => {
  // eslint-disable-next-line functional/no-let
  let callbackMap: CallbackMap = {
    asset: [],
    context: [],
    stateChanged: [],
    loaded: [],
  }
  const pushCallback = <T extends CallbackType>(
    callbackType: T,
    callback: CallbackMap[T][number]['callback'],
  ): CallbackId => {
    const callbackId = randomUid()
    callbackMap = {
      ...callbackMap,
      [callbackType]: [
        ...callbackMap[callbackType],
        {
          callbackId,
          callback,
        },
      ].slice(-maxQueueLength),
    }
    return callbackId
  }
  const popCallback = <T extends CallbackType>(
    callbackType: T,
    callbackId: CallbackId | undefined,
  ): CallbackMap[T][number]['callback'] | undefined => {
    return (callbackMap[callbackType] as CallbackRef<unknown>[]).findLast(
      (it) => it.callbackId === callbackId,
    )?.callback
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
