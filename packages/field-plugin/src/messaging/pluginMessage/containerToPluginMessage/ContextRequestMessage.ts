import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'
import { isStoryData, StoryData } from './StoryData'

//TODO: tests
export type ContextRequestMessage = MessageToPlugin<'get-context'> & {
  story: StoryData
  callbackId: string
}

const hasCallbackId = (
  obj: unknown,
): obj is Pick<ContextRequestMessage, 'callbackId'> => {
  return hasKey(obj, 'callbackId') && typeof obj.callbackId === 'string'
}

export const isContextRequestMessage = (
  data: unknown,
): data is ContextRequestMessage =>
  isMessageToPlugin(data) &&
  data.action === 'get-context' &&
  hasKey(data, 'story') &&
  hasCallbackId(data) &&
  isStoryData(data.story)
