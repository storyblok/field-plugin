<script setup lang="ts">
import { computed } from 'vue'
import { useFieldPluginLoaded } from '../useFieldPlugin'

const plugin = useFieldPluginLoaded()

const handleIncrement = () => {
  plugin.value.actions.setValue(
    (typeof plugin.value.data.value === 'number'
      ? plugin.value.data.value
      : 0) + 1,
  )
}

const label = computed(() =>
  typeof plugin.value.data.value !== 'number'
    ? 0
    : JSON.stringify(plugin.value.data.value),
)
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
