import {
  AssetSelectedMessage,
  ContextRequestMessage,
  OnMessage,
  StateChangedMessage,
} from '../../messaging'

type CallbackId = number
type CallbackRef<Message> = {
  callbackId: CallbackId
  callback: OnMessage<Message>
}
type CallbackMap = {
  asset: CallbackRef<AssetSelectedMessage>[]
  context: CallbackRef<ContextRequestMessage>[]
  state: CallbackRef<StateChangedMessage>[]
}
type CallbackType = keyof CallbackMap

export const callbackQueue = () => {
  // eslint-disable-next-line functional/no-let
  let callbackMap: CallbackMap = {
    asset: [],
    context: [],
    state: [],
  }
  // eslint-disable-next-line functional/no-let
  let uuidIndex = 0
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
    console.log('push', callbackId)
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
    console.log('pop', callbackId)
    return callbackMap[callbackType].findLast(
      (it) => it.callbackId === callbackId,
    )?.callback
  }
  return {
    pushCallback,
    popCallback,
  }
}
