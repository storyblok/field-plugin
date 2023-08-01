import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

type UseFieldPlugin = () => FieldPluginResponse

const parseContent = (content: unknown) =>
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
