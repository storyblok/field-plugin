/**
 * The block schema that describes a custom field
 */
export type FieldPluginSchema = {
  field_type: string
  options: FieldPluginOption[]
}

export type FieldPluginOption = { name: string; value: string }
