import { FieldPluginResponse } from '@storyblok/field-plugin'
import { useContext } from 'react'
import { FieldPluginContext } from './context'

export const useFieldPlugin = <Content>(): Extract<
  FieldPluginResponse<Content>,
  { type: 'loaded' }
> => {
  const plugin = useContext(FieldPluginContext)
  if (!plugin) {
    throw new Error(
      'The plugin is not loaded, yet `useFieldPlugin()` was invoked. Ensure that the component that invoked `useFieldPlugin()` is wrapped within `<FieldPluginProvider>`.',
    )
  }

  return plugin as Extract<FieldPluginResponse<Content>, { type: 'loaded' }>
}
