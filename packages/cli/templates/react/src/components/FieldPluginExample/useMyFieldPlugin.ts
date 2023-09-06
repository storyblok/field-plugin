import { useFieldPlugin } from '@storyblok/field-plugin/react'

export const useMyFieldPlugin = () =>
  useFieldPlugin({
    parseContent: (content: unknown) => content,
  })
