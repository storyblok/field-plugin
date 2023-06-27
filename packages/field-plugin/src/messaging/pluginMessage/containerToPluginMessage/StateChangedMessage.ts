import { FieldPluginSchema, isFieldPluginSchema } from './FieldPluginSchema'
import { hasKey } from '../../../utils'
import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { isStoryData, StoryData } from './StoryData'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
export type StateChangedMessage = MessageToPlugin<'loaded'> & {
  // If no language is available, for example via the field plugin editor, the language will be an empty string `""`
  language: string
  spaceId: number | null
  story: StoryData
  storyId: number | undefined
  blockId: string | undefined
  token: string | null
  // Related to the field type itself
  schema: FieldPluginSchema
  model: unknown
}

// TODO full implementation of validation
export const isStateChangedMessage = (
  data: unknown,
): data is StateChangedMessage =>
  isMessageToPlugin(data) &&
  hasKey(data, 'language') &&
  typeof data.language === 'string' &&
  data.action === 'loaded' &&
  hasKey(data, 'schema') &&
  isFieldPluginSchema(data.schema) &&
  hasKey(data, 'story') &&
  isStoryData(data.story)
