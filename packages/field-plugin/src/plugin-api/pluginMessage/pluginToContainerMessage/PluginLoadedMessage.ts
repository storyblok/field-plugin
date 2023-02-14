import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

export type PluginLoadedMessage = MessageToContainer<'loaded'>
export const isPluginLoadedMessage = (
  obj: unknown,
): obj is PluginLoadedMessage =>
  isMessageToContainer(obj) && obj.event === 'loaded'

export const pluginLoadedMessage = (uid: string): PluginLoadedMessage => ({
  action: 'plugin-changed',
  event: 'loaded',
  uid,
})
