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
