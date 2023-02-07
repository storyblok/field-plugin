import { StateChangedMessage } from './StateChangedMessage'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnMessageToPlugin = (data: StateChangedMessage) => void
