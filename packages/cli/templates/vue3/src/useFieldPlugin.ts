import { FieldPluginResponse } from '@storyblok/field-plugin'
import { inject, Ref } from 'vue'

export function useFieldPlugin() {
  return inject<Ref<FieldPluginResponse>>(
    'field-plugin',
    () => {
      throw new Error(
        `You need to call \`provideFieldPlugin()\` at the root of your app.`,
      )
    },
    true,
  )
}

export function useFieldPluginLoaded() {
  const plugin = useFieldPlugin()
  if (plugin.value.type === 'loaded') {
    return plugin as Ref<Extract<FieldPluginResponse, { type: 'loaded' }>>
  } else {
    throw new Error(
      '`useFieldPlugn()` must be used only after `plugin.type` becomes `loaded`.',
    )
  }
}
