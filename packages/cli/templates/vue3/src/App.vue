<script setup lang="ts">
import FieldPlugin from './components/FieldPlugin.vue'
import FieldPluginProvider from './components/FieldPluginProvider.vue'
</script>

<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <FieldPlugin />
  </FieldPluginProvider>
</template>
