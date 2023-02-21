import { FieldPluginSchema, isFieldPluginSchema } from './FieldPluginSchema'
import { hasKey } from '../../../utils'
import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
// TODO verify this structure
export type StateChangedMessage = MessageToPlugin<'loaded'> & {
  // Related to the context the field type is displayed within
  language: string
  spaceId: number | null
  story: unknown
  // TODO sometimes string?
  storyId: number | undefined
  blockId: number | undefined
  token: string | null
  // Related to the field type itself
  schema: FieldPluginSchema
  model: unknown
}

export const isStateChangedMessage = (
  data: unknown,
): data is StateChangedMessage =>
  isMessageToPlugin(data) &&
  data.action === 'loaded' &&
  hasKey(data, 'schema') &&
  isFieldPluginSchema(data.schema)
