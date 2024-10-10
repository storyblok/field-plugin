import { isMessageToContainer, MessageToContainer } from './MessageToContainer'
import { hasKey } from '../../../utils'

export type PluginLoadedMessage = MessageToContainer<'loaded'> & {
  // signals that the field plugin is responsible for its own scrolling in modal mode
  fullHeight?: boolean
  subscribeState?: boolean
  enablePortalModal?: boolean
}
export const isPluginLoadedMessage = (
  obj: unknown,
): obj is PluginLoadedMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'loaded' &&
  (!hasKey(obj, 'fullHeight') ||
    typeof obj.fullHeight === 'undefined' ||
    typeof obj.fullHeight === 'boolean') &&
  (!hasKey(obj, 'subscribeState') ||
    typeof obj.subscribeState === 'undefined' ||
    typeof obj.subscribeState === 'boolean') &&
  (!hasKey(obj, 'enablePortalModal') ||
    typeof obj.enablePortalModal === 'undefined' ||
    typeof obj.enablePortalModal === 'boolean')

export const pluginLoadedMessage = (
  options: Pick<
    PluginLoadedMessage,
    'uid' | 'callbackId' | 'enablePortalModal'
  >,
): PluginLoadedMessage => ({
  action: 'plugin-changed',
  event: 'loaded',
  fullHeight: true,
  subscribeState: true,
  ...options,
})
