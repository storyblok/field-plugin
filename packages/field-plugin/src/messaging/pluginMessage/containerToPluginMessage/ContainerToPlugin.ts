import { StateChangedMessage } from './StateChangedMessage'
import { AssetSelectedMessage } from './AssetSelectedMessage'
import { ContextRequestMessage } from './ContextRequestMessage'
import { MessageToPlugin } from './MessageToPlugin'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnStateChangeMessage = (message: StateChangedMessage) => void
export type OnAssetSelectMessage = (message: AssetSelectedMessage) => void
export type OnContextRequestMessage = (message: ContextRequestMessage) => void
export type OnUnknownPluginMessage = (message: MessageToPlugin<string>) => void
