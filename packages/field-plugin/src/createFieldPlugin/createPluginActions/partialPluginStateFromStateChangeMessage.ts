import {
  ContextRequestMessage,
  recordFromFieldPluginOptions,
} from '../../../messaging'
import { StateChangedMessage } from '../../../messaging'
import { PluginState } from '../../PluginState'

export const partialPluginStateFromStateChangeMessage = (
  message: StateChangedMessage,
): Omit<PluginState, 'height' | 'isModalOpen'> => ({
  spaceId: message.spaceId ?? undefined,
  story: message.story ?? undefined,
  storyId: message.storyId ?? undefined,
  blockId: message.blockId ?? undefined,
  language: message.language ?? undefined,
  token: message.token ?? undefined,
  options: recordFromFieldPluginOptions(message.schema.options),
  uid: message.uid ?? undefined,
  value: message.model ?? undefined,
})

export const partialPluginStateFromContextRequestMessage = (
  message: ContextRequestMessage,
): Pick<PluginState, 'story'> => ({
  story: message.story ?? undefined,
})
