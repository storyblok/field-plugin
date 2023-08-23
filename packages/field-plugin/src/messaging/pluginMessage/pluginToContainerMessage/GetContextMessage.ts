import { hasKey } from '../../../../src/utils'
import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type GetContextMessage = MessageToContainer<'getContext'> & {
  callbackId: string
}

export const isGetContextMessage = (obj: unknown): obj is GetContextMessage =>
  isMessageToContainer(obj) && obj.event === 'getContext' && hasCallbackId(obj)

const hasCallbackId = (
  obj: unknown,
): obj is Pick<GetContextMessage, 'callbackId'> => {
  return hasKey(obj, 'callbackId') && typeof obj.callbackId === 'string'
}

export const getContextMessage = (
  uid: string,
  callbackId: string,
): GetContextMessage => ({
  action: 'plugin-changed',
  event: 'getContext',
  uid,
  callbackId,
})
