<script setup lang="ts">
import { defineProps } from 'vue'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

defineProps<{
  setModalOpen: PluginActions['setModalOpen']
  isModalOpen: PluginState['isModalOpen']
}>()
</script>

<template>
  <div class="modal-toggle">
    <button
      type="button"
      @click="() => setModalOpen(!isModalOpen)"
    >
      {{ isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>
