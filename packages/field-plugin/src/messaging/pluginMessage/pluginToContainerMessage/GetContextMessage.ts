import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type GetContextMessage = MessageToContainer<'getContext'> & {
  // Previously, debounced message was the default behavior.
  // That debouncing implementation can be problematic, for example,
  // when multiple field plugin instances request for context.
  debounce: false
}

export const isGetContextMessage = (obj: unknown): obj is GetContextMessage =>
  isMessageToContainer(obj) && obj.event === 'getContext'

export const getContextMessage = (
  options: Pick<GetContextMessage, 'uid' | 'callbackId'>,
): GetContextMessage => ({
  action: 'plugin-changed',
  event: 'getContext',
  debounce: false,
  ...options,
})
