import { FieldPluginData } from '../FieldPluginData'
import {
  LoadedMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

export const pluginStateFromStateChangeMessage = <Content>(
  message: LoadedMessage | StateChangedMessage,
  parseContent: (content: unknown) => Content,
): FieldPluginData<Content> => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  storyLang: message.language === '' ? 'default' : message.language,
  blockUid: message.blockId ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  content: parseContent(message.model),
  isModalOpen: message.isModalOpen,
})
