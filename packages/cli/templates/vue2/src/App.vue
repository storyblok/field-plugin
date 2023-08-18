<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <FieldPluginExample />
  </FieldPluginProvider>
</template>

<script>
import { FieldPluginProvider } from '@storyblok/field-plugin/vue2'
import FieldPlugin from './components/FieldPlugin.vue'
import FieldPluginExample from './components/FieldPluginExample/index.vue'

export default {
  components: {
    FieldPluginProvider,
    FieldPlugin,
    FieldPluginExample,
  },
}
</script>

<style scoped>
.field-plugin-provider {
  width: 100%;
}
</style>
