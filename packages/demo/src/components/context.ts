import { createFieldPluginContext } from '@storyblok/field-plugin/react'

export type Content = number
const parseContent = (content: unknown): Content =>
  typeof content === 'number' ? content : 0

export const { FieldPluginProvider, useFieldPlugin } =
  createFieldPluginContext(parseContent)
