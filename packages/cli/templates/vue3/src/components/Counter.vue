<script setup lang="ts">
import { computed } from 'vue'
import { useFieldPlugin } from '../useFieldPlugin'

const plugin = useFieldPlugin()

const handleIncrement = () => {
  const content = plugin.data.content
  plugin.actions.setContent((typeof content === 'number' ? content : 0) + 1)
}

const label = computed(() => {
  const content = plugin.data.content
  return typeof content !== 'number' ? 0 : JSON.stringify(content)
})
</script>

<template>
  <div>
    <h2>Field Value</h2>
    <div class="counter-value">
      {{ label }}
    </div>
    <button
      class="btn w-full"
      @click="handleIncrement"
    >
      Increment
    </button>
  </div>
</template>
