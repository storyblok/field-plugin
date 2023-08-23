import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type PluginLoadedMessage = MessageToContainer<'loaded'> & {
  // signals that the field plugin is responsible for its own scrolling in modal mode
  fullHeight?: boolean
}
export const isPluginLoadedMessage = (
  obj: unknown,
): obj is PluginLoadedMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'loaded' &&
  (!hasKey(obj, 'fullHeight') ||
    typeof obj.fullHeight === 'undefined' ||
    typeof obj.fullHeight === 'boolean')

export const pluginLoadedMessage = (uid: string): PluginLoadedMessage => ({
  action: 'plugin-changed',
  event: 'loaded',
  uid,
  fullHeight: true,
})
