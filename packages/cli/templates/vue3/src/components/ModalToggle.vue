<script setup lang="ts">
import { PluginActions, PluginState } from '@storyblok/field-plugin'

defineProps<{
  setModalOpen: PluginActions['setModalOpen']
  isModalOpen: PluginState['isModalOpen']
}>()
</script>

<template>
  <div class="modal-toggle">
    <button
      class="btn"
      type="button"
      @click="() => setModalOpen(!isModalOpen)"
    >
      {{ isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>
