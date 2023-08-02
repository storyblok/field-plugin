import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

type UseFieldPlugin = () => FieldPluginResponse

type Parser<Content> = (content: unknown) => Content

type Content = number
const parseContent: Parser<Content> = (content) =>
  typeof content === 'number' ? content : 0

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<FieldPluginResponse>(() => ({
    type: 'loading',
  }))

  useEffect(() => {
    return createFieldPlugin(setState, parseContent)
  }, [])

  return state
}
