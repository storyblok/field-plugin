<script setup lang="ts">
import './example.css'
import ModalToggle from './ModalToggle.vue'
import Counter from './Counter.vue'
import AssetSelector from './AssetSelector.vue'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'

const plugin = useFieldPlugin({
  enablePortalModal: true,
  validateContent: (content: unknown) => ({
    content: typeof content === 'number' ? content : 0,
  }),
})
</script>

<template>
  <div v-if="plugin.type === 'loaded'">
    <button
      v-if="plugin.data.isModalOpen"
      type="button"
      class="btn btn-close"
      @click="plugin.actions.setModalOpen(false)"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
          fill="#1B243F"
        />
      </svg>
      <span class="sr-only">Close Modal</span>
    </button>
    <div class="container">
      <Counter
        :count="plugin.data.content"
        @on-increase="plugin.actions.setContent(plugin.data.content + 1)"
      />
      <hr />
      <ModalToggle
        :is-modal-open="plugin.data.isModalOpen"
        :set-modal-open="plugin.actions.setModalOpen"
      />
      <hr />
      <AssetSelector :select-asset="plugin.actions.selectAsset" />
    </div>
  </div>
</template>
