<script setup lang="ts">
import FieldPlugin from './components/FieldPlugin.vue'
import { provideFieldPlugin } from './provideFieldPlugin'
const plugin = provideFieldPlugin()
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
