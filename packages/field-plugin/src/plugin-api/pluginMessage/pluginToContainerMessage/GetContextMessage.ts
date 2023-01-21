import {
  isPluginToWrapperMessage,
  MessageToContainer,
} from './MessageToContainer'

export type GetContextMessage = MessageToContainer<'getContext'>
export const isGetContextMessage = (obj: unknown): obj is GetContextMessage =>
  isPluginToWrapperMessage(obj) && obj.event === 'getContext'
