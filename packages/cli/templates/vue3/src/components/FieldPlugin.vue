<script setup lang="ts">
import ModalToggle from './ModalToggle.vue'
import Counter from './Counter.vue'
import AssetSelector from './AssetSelector.vue'

import { PluginActions, PluginState } from '@storyblok/field-plugin'

const props = defineProps<{
  actions: PluginActions
  data: PluginState
}>()

function closeModal() {
  props.actions.setModalOpen(false)
}
</script>

<template>
  <div class="container">
    <button
      v-if="props.data.isModalOpen"
      type="button"
      class="btn btn-close"
      @click="closeModal"
    >
      Close Modal
    </button>
    <div class="inner-container">
      <Counter
        :data="data"
        :set-value="actions.setValue"
      />
      <hr />
      <ModalToggle
        :is-modal-open="data.isModalOpen"
        :set-modal-open="actions.setModalOpen"
      />
      <hr />
      <AssetSelector
        :data="data"
        :select-asset="actions.selectAsset"
      />
    </div>
  </div>
</template>

<style>
.inner-container {
  max-width: 22rem;
  margin: 0 auto;
  position: relative;
}
.btn-close {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
