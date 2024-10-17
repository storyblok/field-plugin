import Vue from 'vue'
import { createFieldPlugin } from '@storyblok/field-plugin'

export const fieldPluginMixin = {
  created() {
    createFieldPlugin({
      enablePortalModal: true,
      validateContent: (content) => ({
        content: typeof content === 'number' ? content : 0,
      }),
      onUpdateState: (newState) => {
        Vue.set(this.plugin, 'type', newState.type)
        Vue.set(this.plugin, 'error', newState.error)
        Vue.set(this.plugin, 'data', newState.data)
        Vue.set(this.plugin, 'actions', newState.actions)
      },
    })
  },
  data() {
    return {
      plugin: Vue.observable({
        type: 'loading',
      }),
    }
  },
}
