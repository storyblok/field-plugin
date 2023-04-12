<script setup lang="ts">
import { computed } from 'vue'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

const props = defineProps<{
  setValue: PluginActions['setValue']
  data: PluginState
}>()

const handleIncrement = () => {
  props.setValue(
    (typeof props.data.value === 'number' ? props.data.value : 0) + 1,
  )
}

const label = computed(() =>
  typeof props.data.value !== 'number' ? 0 : JSON.stringify(props.data.value),
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
