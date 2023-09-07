import {
  createFieldPlugin,
  CreateFieldPluginOptions,
  FieldPluginResponse,
} from '@storyblok/field-plugin'
import { onMounted, reactive, UnwrapRef } from 'vue'

export const useFieldPlugin = <Content>({
  parseContent,
}: Omit<CreateFieldPluginOptions<Content>, 'onUpdateState'>): UnwrapRef<
  FieldPluginResponse<Content>
> => {
  const plugin = reactive<FieldPluginResponse<Content>>({
    type: 'loading',
  })

  onMounted(() => {
    createFieldPlugin<Content>({
      onUpdateState: (state) => {
        if (state.type === 'error') {
          // plugin.type = 'error'
          // plugin.error = state.error
          Object.assign(plugin, {
            type: 'error',
            error: state.error,
          })
        } else if (state.type === 'loaded') {
          Object.assign(plugin, {
            type: 'loaded',
            data: state.data,
            actions: state.actions,
          })
          // plugin.type = 'loaded'
          // plugin.data = state.data
          // plugin.actions = state.actions
        }
      },
      parseContent,
    })
  })

  return plugin
}
