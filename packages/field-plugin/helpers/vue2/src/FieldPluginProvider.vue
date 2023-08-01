<template>
  <div class="field-plugin-provider">
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
  Vue.set(plugin, 'type', newState.type)
  Vue.set(plugin, 'error', newState.error)
  Vue.set(plugin, 'data', newState.data)
  Vue.set(plugin, 'actions', newState.actions)
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
