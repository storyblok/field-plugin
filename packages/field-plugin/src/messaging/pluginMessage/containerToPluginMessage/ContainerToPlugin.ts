import { LoadedMessage } from './LoadedMessage'
import { AssetSelectedMessage } from './AssetSelectedMessage'
import { ContextRequestMessage } from './ContextRequestMessage'
import { UserContextRequestMessage } from './UserContextRequestMessage'
import { MessageToPlugin } from './MessageToPlugin'
import { StateChangedMessage } from './StateChangedMessage'
import { PromptAIResponseMessage } from './PromptAIResponseMessage'
import { PreviewDimensionResponseMessage } from './PreviewDimensionResponseMessage'

/**
 * The plugin container's sends it's state to the plugin
 */
export type OnMessage<Message> = (message: Message) => void
export type OnStateChangeMessage = (message: StateChangedMessage) => void
export type OnLoadedMessage = (message: LoadedMessage) => void
export type OnAssetSelectMessage = (message: AssetSelectedMessage) => void
export type OnPromptAIMessage = (message: PromptAIResponseMessage) => void
export type OnPreviewDimensionMessage = (
  message: PreviewDimensionResponseMessage,
) => void
export type OnContextRequestMessage = (message: ContextRequestMessage) => void
export type OnUserContextRequestMessage = (
  message: UserContextRequestMessage,
) => void
export type OnUnknownPluginMessage = (message: MessageToPlugin<string>) => void
