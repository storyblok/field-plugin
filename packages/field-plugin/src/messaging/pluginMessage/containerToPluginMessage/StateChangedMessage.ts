import { FieldPluginSchema, isFieldPluginSchema } from './FieldPluginSchema'
import { hasKey } from '../../../utils'
import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { isStoryData, StoryData } from './StoryData'
import { Release } from '../../../createFieldPlugin/FieldPluginData'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
export type StateChangedMessage = MessageToPlugin<'state-changed'> & {
  // If no language is available, for example via the field plugin editor, the language will be an empty string `""`
  language: string
  interfaceLanguage: string
  spaceId: number | null
  userId: number | undefined
  story: StoryData
  storyId: number | undefined
  blockId: string | undefined
  token: string | null
  // Related to the field type itself
  schema: FieldPluginSchema
  model: unknown
  isAIEnabled: boolean
  isModalOpen: boolean
  releases: Release[]
  releaseId: number | undefined
}

// TODO full implementation of validation
export const isStateMessage = (data: unknown): data is StateChangedMessage =>
  isMessageToPlugin(data) &&
  data.action === 'state-changed' &&
  hasKey(data, 'language') &&
  typeof data.language === 'string' &&
  hasKey(data, 'schema') &&
  isFieldPluginSchema(data.schema) &&
  hasKey(data, 'userId') &&
  (typeof data.userId === 'number' || typeof data.userId === 'undefined') &&
  hasKey(data, 'story') &&
  isStoryData(data.story) &&
  hasKey(data, 'isAIEnabled') &&
  typeof data.isAIEnabled === 'boolean' &&
  hasKey(data, 'isModalOpen') &&
  typeof data.isModalOpen === 'boolean'
