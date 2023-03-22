<template>
  <div>
    <span v-if="plugin.type === 'loading'">Loading...</span>
    <span v-else-if="plugin.type === 'error'">Error</span>
    <div
      v-else-if="plugin.type === 'loaded'"
      class="field-plugin"
    >
      <ModalToggle
        :is-modal-open="plugin.data.isModalOpen"
        :set-modal-open="plugin.actions.setModalOpen"
      />
      <Counter
        :data="plugin.data"
        :set-value="plugin.actions.setValue"
      />
      <AssetSelector
        :data="plugin.data"
        :select-asset="plugin.actions.selectAsset"
      />
    </div>
  </div>
</template>

<script>
import './style.css'
import { createFieldPlugin } from '@storyblok/field-plugin'
import AssetSelector from './components/AssetSelector.vue'
import Counter from './components/Counter.vue'
import ModalToggle from './components/ModalToggle.vue'

export default {
  components: {
    AssetSelector,
    Counter,
    ModalToggle,
  },
  data() {
    return {
      plugin: { type: 'loading' },
    }
  },
  created() {
    createFieldPlugin((newState) => (this.plugin = newState))
  },
}
</script>
