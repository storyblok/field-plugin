import { ref, provide } from 'vue'
import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'

let provided = false

export const provideFieldPlugin = () => {
  if (provided) {
    throw new Error('Do not call `provideFieldPlugin()` more than once.')
  }

  provided = true
  const plugin = ref<FieldPluginResponse>({
    type: 'loading',
  })
  createFieldPlugin((newState) => {
    plugin.value = newState
  })
  provide('field-plugin', plugin)

  return plugin
}
