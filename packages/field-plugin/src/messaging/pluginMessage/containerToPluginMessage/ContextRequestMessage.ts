import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'
import { isStoryData, StoryData } from './StoryData'

//TODO: tests
export type ContextRequestMessage = MessageToPlugin<'get-context'> & {
  story: StoryData
}

export const isContextRequestMessage = (
  data: unknown,
): data is ContextRequestMessage =>
  isMessageToPlugin(data) &&
  data.action === 'get-context' &&
  hasKey(data, 'story') &&
  isStoryData(data.story)
