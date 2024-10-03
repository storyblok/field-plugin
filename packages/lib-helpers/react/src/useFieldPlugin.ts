import {
  createFieldPlugin,
  type CreateFieldPluginOptions,
  type FieldPluginResponse,
} from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

export const useFieldPlugin = <Content>(
  options: Omit<CreateFieldPluginOptions<Content>, 'onUpdateState'> = {},
): FieldPluginResponse<Content> => {
  const [plugin, setPlugin] = useState<FieldPluginResponse<Content>>({
    type: 'loading',
  })

  useEffect(
    () =>
      createFieldPlugin<Content>({
        ...options,
        onUpdateState: (state) => {
          if (state.type === 'error') {
            setPlugin({
              type: 'error',
              error: state.error,
            })
          } else if (state.type === 'loaded') {
            setPlugin({
              type: 'loaded',
              data: state.data,
              actions: state.actions,
            })
          }
        },
      }),
    [],
  )

  return plugin
}
