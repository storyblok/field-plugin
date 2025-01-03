import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type GetUserContextMessage = MessageToContainer<'getUserContext'>

export const isGetUserContextMessage = (
  obj: unknown,
): obj is GetUserContextMessage =>
  isMessageToContainer(obj) && obj.event === 'getUserContext'

export const getUserContextMessage = (
  options: Pick<GetUserContextMessage, 'uid' | 'callbackId'>,
): GetUserContextMessage => ({
  action: 'plugin-changed',
  event: 'getUserContext',
  ...options,
})
