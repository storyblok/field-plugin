<script setup lang="ts">
import { ref } from 'vue'
import { useFieldPlugin } from './useFieldPlugin'

const plugin = useFieldPlugin()
const imageUrl = ref('')

const handleIncrement = () => {
  plugin.value.actions?.setValue(
    (typeof plugin.value.data.value === 'number'
      ? plugin.value.data.value
      : 0) + 1,
  )
}

const toggleModal = () => {
  plugin.value.actions?.setModalOpen(!plugin.value.data.isModalOpen)
}

const handleSelectAsset = () => {
  plugin.value.actions?.selectAsset((filename) => (imageUrl.value = filename))
}
</script>

<template>
  <div>
    <div v-if="plugin.type === 'loading'">Loading...</div>
    <div v-else-if="plugin.type === 'error'">Error</div>
    <div v-else>
      <div>
        <span
          >Value:
          {{
            typeof plugin.data?.value !== 'number'
              ? 0
              : JSON.stringify(plugin.data.value)
          }}</span
        >
        <button @click="handleIncrement">Increment</button>
      </div>
      <div>
        <button @click="toggleModal">
          {{ plugin.data.isModalOpen ? 'Close' : 'Open' }} modal
        </button>
      </div>
      <div>
        <button @click="handleSelectAsset">Select Asset</button>
        <span>Image Url: {{ imageUrl }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
