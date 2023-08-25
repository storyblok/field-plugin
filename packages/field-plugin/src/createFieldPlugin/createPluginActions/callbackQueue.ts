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

export const callbackQueue = () => {
  // eslint-disable-next-line functional/no-let
  let callbackMap: CallbackMap = {
    asset: [],
    context: [],
    stateChanged: [],
    loaded: [],
  }
  // eslint-disable-next-line functional/no-let
  let uuidIndex = 0
  // TODO randomly generate instead
  const uuid = (): CallbackId => {
    uuidIndex = uuidIndex + 1
    return uuidIndex
  }

  const pushCallback = <T extends CallbackType>(
    callbackType: T,
    callback: CallbackMap[T][number]['callback'],
  ): CallbackId => {
    // TODO limit length of array
    const callbackId = uuid()
    callbackMap = {
      ...callbackMap,
      [callbackType]: [
        ...callbackMap[callbackType],
        {
          callbackId,
          callback,
        },
      ],
    }
    return callbackId
  }
  const popCallback = <T extends CallbackType>(
    callbackType: T,
    callbackId: CallbackId | undefined,
  ): CallbackMap[T][number]['callback'] | undefined => {
    // TODO remove callback when popping
    // TODO test: that the order of insertion matched the direction we search from
    return callbackMap[callbackType].findLast(
      (it) => it.callbackId === callbackId,
    )?.callback
  }
  return {
    pushCallback,
    popCallback,
  }
}
