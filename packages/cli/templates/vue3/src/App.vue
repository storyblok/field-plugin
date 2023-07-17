<script setup lang="ts">
import FieldPlugin from './components/FieldPlugin.vue'
import FieldPluginExample from './components/FieldPluginExample/index.vue'
import { FieldPluginProvider } from '@storyblok/field-plugin/vue3'
</script>

<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <FieldPluginExample />
  </FieldPluginProvider>
</template>
