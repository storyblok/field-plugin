<script setup lang="ts">
import { defineProps } from 'vue'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

defineProps<{
  actions: PluginActions
  data: PluginState
}>()
</script>

<template>
  <div class="modal-toggle">
    <button
      type="button"
      @click="() => actions.setModalOpen(!data.isModalOpen)"
    >
      {{ data.isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>
