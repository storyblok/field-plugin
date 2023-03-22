import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'
import { onMounted, ref } from 'vue'

export function useFieldPlugin() {
  const state = ref<FieldPluginResponse>({
    type: 'loading',
  })

  onMounted(() => {
    createFieldPlugin((newState) => {
      state.value = newState
    })
  })

  return state
}
