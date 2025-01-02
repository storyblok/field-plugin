import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type GetUserContextMessage = MessageToContainer<'getUserContext'> & {
  // Previously, debounced message was the default behavior.
  // That debouncing implementation can be problematic, for example,
  // when multiple field plugin instances request for context.
  debounce: false
}

export const isGetUserContextMessage = (
  obj: unknown,
): obj is GetUserContextMessage =>
  isMessageToContainer(obj) && obj.event === 'getUserContext'

export const getUserContextMessage = (
  options: Pick<GetUserContextMessage, 'uid' | 'callbackId'>,
): GetUserContextMessage => ({
  action: 'plugin-changed',
  event: 'getUserContext',
  debounce: false,
  ...options,
})
