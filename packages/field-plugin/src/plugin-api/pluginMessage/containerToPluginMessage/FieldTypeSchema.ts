/**
 * The block schema that describes a custom field
 */
export type FieldTypeSchema = {
  field_type: string
  options: FieldTypeOption[]
}

export type FieldTypeOption = { name: string; value: string }
