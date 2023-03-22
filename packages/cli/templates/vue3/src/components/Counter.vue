<script setup lang="ts">
import { defineProps, computed } from 'vue'
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
  <div className="increment">
    <button @click="handleIncrement">Increment</button>
    <span>Value: {{ label }}</span>
  </div>
</template>
