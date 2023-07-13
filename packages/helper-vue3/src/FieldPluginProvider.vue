<script setup lang="ts">
import { provide, reactive } from 'vue'
import {
  createFieldPlugin,
  FieldPluginResponse,
  FieldPluginData,
} from '@storyblok/field-plugin'
import { convertToRaw } from '../utils'

const plugin = reactive<FieldPluginResponse>({
  type: 'loading',
})
createFieldPlugin((newState) => {
  // Instead of replacing `plugin.data` which loses the reactive reference,
  // we're assigning each property into `plugin.data`.

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
        // @ts-ignore not sure how to solve this
        Object.assign(plugin.data[key], newState.data[key])
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
        newState.actions.setContent(convertToRaw(newContent))
      },
    }
  } else {
    plugin.actions = undefined
  }

  plugin.type = newState.type
  plugin.error = newState.error
})
provide('field-plugin', plugin)
</script>

<template>
  <slot
    name="loading"
    v-if="plugin.type === 'loading'"
  ></slot>
  <slot
    name="error"
    v-if="plugin.type === 'error'"
  ></slot>
  <slot v-if="plugin.type === 'loaded'"></slot>
</template>
