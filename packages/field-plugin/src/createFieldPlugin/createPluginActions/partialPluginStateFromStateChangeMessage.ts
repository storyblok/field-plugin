import { FieldPluginData } from '../FieldPluginData'
import {
  ContextRequestMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

export const partialPluginStateFromStateChangeMessage = (
  message: StateChangedMessage,
): Omit<FieldPluginData, 'isModalOpen'> => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  blockUid: message.blockId ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  value: message.model ?? undefined,
})

export const partialPluginStateFromContextRequestMessage = (
  message: ContextRequestMessage,
): Pick<FieldPluginData, 'story'> => ({
  story: message.story ?? undefined,
})
