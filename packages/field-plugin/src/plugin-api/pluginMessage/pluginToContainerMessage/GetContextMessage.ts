import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type GetContextMessage = MessageToContainer<'getContext'>
export const isGetContextMessage = (obj: unknown): obj is GetContextMessage =>
  isMessageToContainer(obj) && obj.event === 'getContext'
