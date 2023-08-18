import { FieldPluginData } from '../FieldPluginData'
import {
  ContextRequestMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

//TODO: create a test
export const partialPluginStateFromStateChangeMessage = (
  message: StateChangedMessage,
): Omit<FieldPluginData, 'isModalOpen'> => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  storyLang: message.language === '' ? 'default' : message.language,
  blockUid: message.blockId ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  content: message.model ?? undefined,
})

export const partialPluginStateFromContextRequestMessage = (
  message: ContextRequestMessage,
): Pick<FieldPluginData, 'story'> => ({
  story: message.story ?? undefined,
})
