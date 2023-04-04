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
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
          fill="#1B243F"
        />
      </svg>
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
  border: 0;
}

.btn-close:hover {
  background-color: var(--light_75);
}
</style>
