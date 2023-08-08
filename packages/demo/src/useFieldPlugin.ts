import {
  createFieldPlugin,
  FieldPluginOptions,
  FieldPluginResponse,
} from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

export const useFieldPlugin = <Content>(
  options: FieldPluginOptions<Content>,
): FieldPluginResponse<Content> => {
  const [state, setState] = useState<FieldPluginResponse<Content>>(() => ({
    type: 'loading',
  }))

  useEffect(
    () =>
      createFieldPlugin<Content>(setState, {
        parseContent: options.parseContent,
      }),
    [options.parseContent],
  )

  return state
}
