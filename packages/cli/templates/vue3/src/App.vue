<script setup lang="ts">
import { useFieldPlugin } from './useFieldPlugin'
import ModalToggle from './components/ModalToggle.vue'
import Counter from './components/Counter.vue'
import AssetSelector from './components/AssetSelector.vue'

const plugin = useFieldPlugin()
</script>

<template>
  <div>
    <div v-if="plugin.type === 'loading'">Loading...</div>
    <div v-else-if="plugin.type === 'error'">Error</div>
    <div
      v-else-if="plugin.type === 'loaded'"
      class="field-plugin"
    >
      <ModalToggle
        :data="plugin.data"
        :actions="plugin.actions"
      />
      <Counter
        :data="plugin.data"
        :actions="plugin.actions"
      />
      <AssetSelector
        :data="plugin.data"
        :actions="plugin.actions"
      />
    </div>
  </div>
</template>
