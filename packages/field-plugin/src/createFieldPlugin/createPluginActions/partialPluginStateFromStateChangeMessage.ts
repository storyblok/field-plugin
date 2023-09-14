import { FieldPluginData } from '../FieldPluginData'
import {
  LoadedMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

export const pluginStateFromStateChangeMessage = (
  message: LoadedMessage | StateChangedMessage,
): FieldPluginData => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  storyLang: message.language === '' ? 'default' : message.language,
  blockUid: message.blockId ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  content: message.model ?? undefined,
  isModalOpen: message.isModalOpen,
})
