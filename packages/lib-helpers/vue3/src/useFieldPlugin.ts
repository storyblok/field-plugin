import {
  createFieldPlugin,
  CreateFieldPluginOptions,
  FieldPluginData,
  FieldPluginResponse,
} from '@storyblok/field-plugin'
import { onMounted, onUnmounted, reactive, UnwrapRef } from 'vue'
import { convertToRaw } from './utils'

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

export const useFieldPlugin = <Content>(
  options: Omit<CreateFieldPluginOptions<Content>, 'onUpdateState'> = {},
): UnwrapRef<FieldPluginResponse<Content>> => {
  const plugin = reactive<FieldPluginResponse<Content>>({
    type: 'loading',
  })

  let cleanup: () => void = () => undefined

  onMounted(() => {
    cleanup = createFieldPlugin<Content>({
      ...options,
      onUpdateState: (state) => {
        if (state.type === 'error') {
          Object.assign(plugin, {
            type: 'error',
            error: state.error,
          })
          return
        }

        if (state.type === 'loaded' && plugin.type === 'loading') {
          Object.assign(plugin, {
            type: 'loaded',
            data: state.data,
            actions: {
              ...state.actions,
              setContent: (newContent: Content) => {
                return state.actions.setContent(convertToRaw(newContent))
              },
            },
          })
          return
        }

        if (state.type === 'loaded' && plugin.type === 'loaded') {
          const keys = Object.keys(state.data) as Array<
            keyof FieldPluginData<unknown>
          >

          keys.forEach((key) => {
            const hasValueChanged =
              JSON.stringify(plugin.data[key]) !==
              JSON.stringify(state.data[key])

            if (!hasValueChanged) {
              return
            }

            if (
              typeof plugin.data[key] === 'object' &&
              plugin.data[key] !== null
            ) {
              updateObjectWithoutChangingReference(
                plugin.data[key] as Record<string, unknown>,
                state.data[key] as Record<string, unknown>,
              )
              return
            }

            Object.assign(plugin.data, {
              [key]: state.data[key],
            })
          })

          return
        }
      },
    })
  })

  onUnmounted(cleanup)

  return plugin
}
