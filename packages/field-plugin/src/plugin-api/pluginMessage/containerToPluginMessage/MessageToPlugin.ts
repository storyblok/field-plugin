import { FieldPluginSchema, isFieldPluginSchema } from './FieldPluginSchema'
import { hasKey } from '../../../utils'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
// TODO verify this structure
export type MessageToPlugin = {
  // Metadata
  action: 'loaded'
  uid: string
  // The language relates to the context the field type is displayed within.
  //  If there's no context, for example in the field plugin editor, an empty string will be returned
  language: string | ''
  // TODO sometimes string?
  storyId: number | undefined
  story: unknown
  blockId: number | undefined
  // Space context
  spaceId: number | null
  token: string | null
  // Related to the field type itself
  schema: FieldPluginSchema
  model: unknown
}

export const isMessageToPlugin = (data: unknown): data is MessageToPlugin =>
  hasKey(data, 'action') &&
  data.action === 'loaded' &&
  hasKey(data, 'uid') &&
  typeof data.uid === 'string' &&
  hasKey(data, 'schema') &&
  isFieldPluginSchema(data.schema)
