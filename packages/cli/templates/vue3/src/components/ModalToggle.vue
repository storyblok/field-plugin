<script setup lang="ts">
import { PluginActions, PluginState } from '@storyblok/field-plugin'

defineProps<{
  setModalOpen: PluginActions['setModalOpen']
  isModalOpen: PluginState['isModalOpen']
}>()
</script>

<template>
  <div>
    <h2>Modal</h2>
    <button
      class="btn w-full"
      type="button"
      @click="() => setModalOpen(!isModalOpen)"
    >
      {{ isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>
