import {
  isPluginToWrapperMessage,
  MessageToContainer,
} from './MessageToContainer'

export type PluginLoadedMessage = MessageToContainer<'loaded'>
export const isPluginLoadedMessage = (
  obj: unknown,
): obj is PluginLoadedMessage =>
  isPluginToWrapperMessage(obj) && obj.event === 'loaded'
