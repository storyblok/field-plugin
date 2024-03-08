/**
 * The block schema that describes a custom field
 */
import { hasKey } from '../../../utils'

export type FieldPluginSchema = {
  field_type: string
  options: FieldPluginOption[]
  translatable?: boolean
}

export type FieldPluginOption = { name: string; value: string }

export const isFieldPluginOption = (it: unknown): it is FieldPluginOption =>
  hasKey(it, 'name') &&
  typeof it.name === 'string' &&
  hasKey(it, 'value') &&
  typeof it.value === 'string'

export const isFieldPluginSchema = (it: unknown): it is FieldPluginSchema =>
  hasKey(it, 'field_type') &&
  typeof it.field_type === 'string' &&
  hasKey(it, 'options') &&
  Array.isArray(it.options) &&
  it.options.every(isFieldPluginOption) &&
  (!hasKey(it, 'translatable') ||
    (hasKey(it, 'translatable') && typeof it.translatable === 'boolean'))
