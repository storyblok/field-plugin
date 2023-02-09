import { recordFromFieldPluginOptions } from '../../../../plugin-api'
import { PluginState } from '../../../index'
import { StateChangedMessage } from '../../../../plugin-api'

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