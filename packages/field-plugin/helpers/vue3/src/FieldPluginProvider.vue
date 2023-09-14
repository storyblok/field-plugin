<script setup lang="ts">
import { provide, reactive } from 'vue'
import {
  createFieldPlugin,
  FieldPluginResponse,
  FieldPluginData,
} from '@storyblok/field-plugin'
import { convertToRaw } from './utils'

const plugin = reactive<FieldPluginResponse<unknown>>({
  type: 'loading',
})

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
  // @ts-ignore not sure how to solve this
  Object.assign(originalObject, newObject)
}

createFieldPlugin({
  parseContent: (content: unknown) => content,
  onUpdateState: (newState) => {
    // Instead of replacing `plugin.data` which loses the reactive reference,
    // we're assigning each property into `plugin.data`.

    if (newState.type === 'loaded' && plugin.type === 'loading') {
      Object.assign(plugin, {
        type: 'loaded',
        data: newState.data,
      })
    }

    if (newState.type === 'loaded' && plugin.type === 'loaded') {
      const keys = Object.keys(newState.data) as Array<
        keyof FieldPluginData<unknown>
      >
      keys.forEach((key) => {
        if (typeof plugin.data[key] === 'object') {
          updateObjectWithoutChangingReference(
            plugin.data[key] as Record<string, unknown>,
            newState.data[key] as Record<string, unknown>,
          )
        } else {
          // @ts-ignore not sure how to solve this
          plugin.data[key] = newState.data[key]
        }
      })
    }

    if (newState.actions) {
      plugin.actions = {
        ...newState.actions,
        setContent: (newContent: unknown) => {
          return newState.actions.setContent(convertToRaw(newContent))
        },
      }
    } else {
      plugin.actions = undefined
    }

    plugin.type = newState.type
    plugin.error = newState.error
  },
})
provide('field-plugin', plugin)
  < /script>

  < template >
  <slot
    name="loading"
v -if= "plugin.type === 'loading'"
  > </slot>
  < slot
    name = "error"
v -if= "plugin.type === 'error'"
  > </slot>
  < slot v -if= "plugin.type === 'loaded'" > </slot>
    < /template>
import { provide, reactive } from 'vue'
import {
  createFieldPlugin,
  FieldPluginResponse,
  FieldPluginData,
} from '@storyblok/field-plugin'
import { convertToRaw } from './utils'

const plugin = reactive<FieldPluginResponse<unknown>>({
  type: 'loading',
})

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
  // @ts-ignore not sure how to solve this
  Object.assign(originalObject, newObject)
}

createFieldPlugin({
  parseContent: (content: unknown) => content,
  onUpdateState: (newState) => {
    // Instead of replacing `plugin.data` which loses the reactive reference,
    // we're assigning each property into `plugin.data`.

<<<<<<< HEAD
    if (newState.type === 'loaded' && plugin.type === 'loading') {
      Object.assign(plugin, {
        type: 'loaded',
        data: newState.data,
      })
=======
  if (newState.type === 'loaded' && plugin.type === 'loading') {
    Object.assign(plugin, {
      type: 'loaded',
      data: newState.data,
    })
  }

  if (newState.type === 'loaded' && plugin.type === 'loaded') {
    const keys = Object.keys(newState.data) as Array<keyof FieldPluginData>
    keys.forEach((key) => {
      if (typeof plugin.data[key] === 'object') {
        updateObjectWithoutChangingReference(
          plugin.data[key] as Record<string, unknown>,
          newState.data[key] as Record<string, unknown>,
        )
      } else {
        // @ts-ignore not sure how to solve this
        plugin.data[key] = newState.data[key]
      }
    })
  }

  if (newState.actions) {
    plugin.actions = {
      ...newState.actions,
      setContent: (newContent: unknown) => {
        return newState.actions.setContent(convertToRaw(newContent))
      },
>>>>>>> main
    }

    if (newState.type === 'loaded' && plugin.type === 'loaded') {
      const keys = Object.keys(newState.data) as Array<
        keyof FieldPluginData<unknown>
      >
      keys.forEach((key) => {
        if (typeof plugin.data[key] === 'object') {
          updateObjectWithoutChangingReference(
            plugin.data[key] as Record<string, unknown>,
            newState.data[key] as Record<string, unknown>,
          )
        } else {
          // @ts-ignore not sure how to solve this
          plugin.data[key] = newState.data[key]
        }
      })
    }

    if (newState.actions) {
      plugin.actions = {
        ...newState.actions,
        setContent: (newContent: unknown) => {
          return newState.actions.setContent(convertToRaw(newContent))
        },
      }
    } else {
      plugin.actions = undefined
    }

    plugin.type = newState.type
    plugin.error = newState.error
  },
})
provide('field-plugin', plugin)
</script>

<template>
  <slot name="loading" v-if="plugin.type === 'loading'"></slot>
  <slot name="error" v-if="plugin.type === 'error'"></slot>
  <slot v-if="plugin.type === 'loaded'"></slot>
</template>
