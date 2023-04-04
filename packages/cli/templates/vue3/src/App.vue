<script setup lang="ts">
import { useFieldPlugin } from './useFieldPlugin'
import FieldPlugin from './components/FieldPlugin.vue'

const plugin = useFieldPlugin()
</script>

<template>
  <span v-if="plugin.type === 'loading'">Loading...</span>
  <span v-else-if="plugin.type === 'error'">Error</span>
  <FieldPlugin
    v-else-if="plugin.type === 'loaded'"
    :data="plugin.data"
    :actions="plugin.actions"
  />
</template>

<style scoped>
hr {
  border-top: 1px dashed var(--light);
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  margin: 1.25rem 0;
}
</style>
