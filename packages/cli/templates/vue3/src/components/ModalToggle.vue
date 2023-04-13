<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'

const plugin = useFieldPlugin()
</script>

<template>
  <div>
    <h2>Modal</h2>
    <button
      class="btn w-full"
      type="button"
      @click="() => plugin.actions.setModalOpen(!plugin.data.isModalOpen)"
    >
      {{ plugin.data.isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>
