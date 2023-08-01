import { FieldPluginData } from '../FieldPluginData'
import {
  ContextRequestMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

//TODO: create a test
export const partialPluginStateFromStateChangeMessage = <Content>(
  message: StateChangedMessage,
  parseContent: (content: unknown) => Content,
): Omit<FieldPluginData<Content>, 'isModalOpen'> => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  storyLang: message.language === '' ? 'default' : message.language,
  blockUid: message.blockId ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  content: parseContent(message.model),
})

export const partialPluginStateFromContextRequestMessage = (
  message: ContextRequestMessage,
): Pick<FieldPluginData, 'story'> => ({
  story: message.story ?? undefined,
})
