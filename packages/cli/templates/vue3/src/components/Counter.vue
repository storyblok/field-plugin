<script setup lang="ts">
import { computed } from 'vue'
import { useFieldPluginLoaded } from '../useFieldPlugin'

const plugin = useFieldPluginLoaded()

const handleIncrement = () => {
  const value = plugin.value.data.value
  plugin.value.actions.setValue((typeof value === 'number' ? value : 0) + 1)
}

const label = computed(() => {
  const value = plugin.value.data.value
  return typeof value !== 'number' ? 0 : JSON.stringify(value)
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
