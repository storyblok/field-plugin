<script setup lang="ts">
import { provide, reactive } from 'vue'
import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'

const plugin = reactive<FieldPluginResponse>({
  type: 'loading',
})
createFieldPlugin((newState) => {
  plugin.type = newState.type
  plugin.error = newState.error
  plugin.data = newState.data
  plugin.actions = newState.actions
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
