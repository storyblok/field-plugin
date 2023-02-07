import { StateChangedMessage } from './StateChangedMessage'
import { AssetSelectedMessage } from './AssetSelectedMessage'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnStateChangedMessage = (data: StateChangedMessage) => void
export type OnAssetSelectedMessage = (filename: AssetSelectedMessage) => void
