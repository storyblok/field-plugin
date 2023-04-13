import { FieldPluginResponse } from '@storyblok/field-plugin'
import { useContext } from 'react'
import { FieldPluginContext } from './FieldPluginProvider'

export const useFieldPlugin = () => {
  const plugin = useContext(FieldPluginContext)
  if (plugin === null) {
    throw new Error(
      `You need to wrap your app with \`<FieldPluginProvider>\` component.`,
    )
  }

  if (plugin.type !== 'loaded') {
    throw new Error(
      'The plugin is not loaded, yet `useFieldPlugin()` was invoked. Ensure that the component that invoked `useFieldPlugin()` is wrapped within `<FieldPluginProvider>`.',
    )
  }
  return plugin as Extract<FieldPluginResponse, { type: 'loaded' }>
}
