import {
  createFieldPlugin,
  CreateFieldPluginOptions,
  FieldPluginData,
  FieldPluginResponse,
} from '@storyblok/field-plugin'
import { onMounted, reactive, UnwrapRef } from 'vue'

const updateObjectWithoutChangingReference = (
  originalObject: Record<string, unknown>,
  newObject: Record<string, unknown>,
) => {
  // Delete keys that do not exist anymore
  Object.keys(originalObject).forEach((key) => {
    if (newObject[key] === undefined) {
      delete originalObject[key]
    }
  })
  // Update the original object with the new one
  Object.assign(originalObject, newObject)
}

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
          plugin.type = 'error'
          plugin.error = state.error
        }

        if (state.type === 'loaded' && plugin.type === 'loading') {
          Object.assign(plugin, {
            type: 'loaded',
            data: state.data,
            actions: state.actions,
          })
        }

        if (state.type === 'loaded' && plugin.type === 'loaded') {
          const keys = Object.keys(state.data) as Array<
            keyof FieldPluginData<unknown>
          >

          keys.forEach((key) => {
            //check if changes are present
            if (
              JSON.stringify(plugin.data[key]) ===
              JSON.stringify(state.data[key])
            ) {
              return
            }

            if (typeof plugin.data[key] === 'object') {
              updateObjectWithoutChangingReference(
                plugin.data[key] as Record<string, unknown>,
                state.data[key] as Record<string, unknown>,
              )
              return
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore not sure how to solve this
            plugin.data[key] = state.data[key]
          })
        }
      },
      parseContent,
    })
  })

  return plugin
}
