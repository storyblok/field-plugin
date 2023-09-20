import { FieldPluginSchema, isFieldPluginSchema } from './FieldPluginSchema'
import { hasKey } from '../../../utils'
import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { isStoryData, StoryData } from './StoryData'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
export type LoadedMessage = MessageToPlugin<'loaded'> & {
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
  isModalOpen: boolean
}

// TODO full implementation of validation
export const isLoadedMessage = (data: unknown): data is LoadedMessage =>
  isMessageToPlugin(data) &&
  data.action === 'loaded' &&
  hasKey(data, 'language') &&
  typeof data.language === 'string' &&
  hasKey(data, 'schema') &&
  isFieldPluginSchema(data.schema) &&
  hasKey(data, 'story') &&
  isStoryData(data.story) &&
  hasKey(data, 'isModalOpen') &&
  typeof data.isModalOpen === 'boolean'
