<script setup lang="ts">
import { useFieldPlugin } from './useFieldPlugin'
import ModalToggle from './components/ModalToggle.vue'
import Counter from './components/Counter.vue'
import AssetSelector from './components/AssetSelector.vue'

const plugin = useFieldPlugin()
</script>

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
