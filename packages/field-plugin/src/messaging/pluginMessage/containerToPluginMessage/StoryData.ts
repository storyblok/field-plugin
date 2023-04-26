import { hasKey } from '../../../utils'

/**
 * The story object that is attached to "get-context", "loaded".
 */
export type StoryData = {
  content: Record<string, unknown>
  lang?: 'default' | string
} & Record<string, unknown>

export const isStoryData = (data: unknown): data is StoryData =>
  hasKey(data, 'content') &&
  typeof data.content === 'object' &&
  data.content !== null &&
  !Array.isArray(data.content) &&
  (!hasKey(data, 'lang') ||
    (hasKey(data, 'lang') && typeof data.lang === 'string'))
