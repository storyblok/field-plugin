<template>
  <div>
    <slot
      name="loading"
      v-if="plugin.type === 'loading'"
    ></slot>
    <slot
      name="error"
      v-if="plugin.type === 'error'"
    ></slot>
    <slot v-if="plugin.type === 'loaded'"></slot>
  </div>
</template>

<script>
import { createFieldPlugin } from '@storyblok/field-plugin'
import Vue from 'vue'

const plugin = Vue.observable({
  type: 'loading',
})

createFieldPlugin((newState) => {
  plugin.type = newState.type
  plugin.error = newState.error
  plugin.data = newState.data
  plugin.actions = newState.actions
})

export default {
  provide: {
    plugin,
  },
  data() {
    return { plugin }
  },
}
</script>
