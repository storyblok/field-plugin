import { FieldTypeSchema } from '../../plugin-api'

/**
 * The message that the field type wrapper (parent) sends to the
 *  field type (child) via postMessage().
 */
// TODO verify this structure
export type MessageToPlugin = {
  // Metadata
  action: 'loaded'
  uid: string
  // Related to the context the field type is displayed within
  language: string
  spaceId: number | null
  story: unknown
  storyId: number | undefined  // TODO sometimes string?
  blockId: number | undefined
  token: string | null
  // Related to the field type itself
  schema: FieldTypeSchema
  model: unknown
}
