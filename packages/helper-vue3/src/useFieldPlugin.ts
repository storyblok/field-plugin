import { inject } from 'vue'
import { FieldPluginResponse } from '@storyblok/field-plugin'

export const useFieldPlugin = <Content>(): Extract<
  FieldPluginResponse<Content>,
  { type: 'loaded' }
> => {
  const plugin = inject<FieldPluginResponse<Content>>(
    'field-plugin',
    () => {
      throw new Error(
        `You need to wrap your app with \`<FieldPluginProvider>\` component.`,
      )
    },
    true,
  )

  if (plugin.type !== 'loaded') {
    throw new Error(
      'The plugin is not loaded, yet `useFieldPlugin()` was invoked. Ensure that the component that invoked `useFieldPlugin()` is wrapped within `<FieldPluginProvider>`, and that it is placed within the default slot.',
    )
  }

  return plugin
}
