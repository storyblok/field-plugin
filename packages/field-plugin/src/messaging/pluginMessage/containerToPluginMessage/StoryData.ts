import { hasKey } from '../../../utils'

/**
 * The story object that is attached to "get-context", "loaded".
 */
export type StoryData = {
  content: Record<string, unknown>
} & Record<string, unknown>

export const isStoryData = (data: unknown): data is StoryData =>
  hasKey(data, 'content') &&
  typeof data.content === 'object' &&
  data.content !== null &&
  !Array.isArray(data.content)
