<script setup lang="ts">
import './example.css'
import ModalToggle from './ModalToggle.vue'
import Counter from './Counter.vue'
import AssetSelector from './AssetSelector.vue'
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'

const plugin = useFieldPlugin({
  parseContent: (content: unknown) =>
    typeof content === 'number' ? content : 0,
})

function closeModal() {
  plugin.actions.setModalOpen(false)
}
</script>

<template>
  <div v-if="plugin.type === 'loaded'">
    <pre>{{ plugin }}</pre>

    <button
      v-if="plugin.data.isModalOpen"
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
          d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
          fill="#1B243F"
        />
      </svg>
      <span class="sr-only">Close Modal</span>
    </button>
    <div class="container">
      <!--      <Counter />-->
      <!--      <hr />-->
      <!--      <ModalToggle />-->
      <!--      <hr />-->
      <!--      <AssetSelector />-->
    </div>
  </div>
</template>
