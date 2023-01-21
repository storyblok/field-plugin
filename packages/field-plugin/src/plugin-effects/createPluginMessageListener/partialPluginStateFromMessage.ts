import { recordFromOptions } from './recordFromOptions'
import { PluginState } from '../index'
import { MessageToPlugin } from '../../plugin-api/pluginMessage/containerToPluginMessage/MessageToPlugin'

export const partialPluginStateFromMessage = (
  loadedData: MessageToPlugin,
): Omit<PluginState, 'height' | 'isModalOpen'> => ({
  spaceId: loadedData.spaceId ?? undefined,
  story: loadedData.story ?? undefined,
  storyId: loadedData.storyId ?? undefined,
  blockId: loadedData.blockId ?? undefined,
  language: loadedData.language ?? undefined,
  token: loadedData.token ?? undefined,
  options: recordFromOptions(loadedData.schema.options),
  uid: loadedData.uid ?? undefined,
  value: loadedData.model ?? undefined,
})
