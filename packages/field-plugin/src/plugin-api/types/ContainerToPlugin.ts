import { MessageToPlugin } from '../../container-effects'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnMessageToPlugin = (data: MessageToPlugin) => void
