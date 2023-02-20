import { recordFromFieldPluginOptions } from '../../../plugin-api'
import { StateChangedMessage } from '../../../plugin-api'
import { PluginState } from '../../PluginState'

export const partialPluginStateFromMessage = (
  loadedData: StateChangedMessage,
): Omit<PluginState, 'height' | 'isModalOpen'> => ({
  spaceId: loadedData.spaceId ?? undefined,
  story: loadedData.story ?? undefined,
  storyId: loadedData.storyId ?? undefined,
  blockId: loadedData.blockId ?? undefined,
  language: loadedData.language ?? undefined,
  token: loadedData.token ?? undefined,
  options: recordFromFieldPluginOptions(loadedData.schema.options),
  uid: loadedData.uid ?? undefined,
  value: loadedData.model ?? undefined,
})
