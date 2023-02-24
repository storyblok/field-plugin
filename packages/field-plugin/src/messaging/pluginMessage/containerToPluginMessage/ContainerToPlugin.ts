import { StateChangedMessage } from './StateChangedMessage'
import { AssetSelectedMessage } from './AssetSelectedMessage'
import { ContextRequestMessage } from './ContextRequestMessage'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnStateChangeMessage = (data: StateChangedMessage) => void
export type OnAssetSelectMessage = (filename: AssetSelectedMessage) => void
export type OnContextRequestMessage = (data: ContextRequestMessage) => void
