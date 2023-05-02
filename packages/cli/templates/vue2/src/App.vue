<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <FieldPlugin />
  </FieldPluginProvider>
</template>

<script>
import FieldPluginProvider from './components/FieldPluginProvider.vue'
import FieldPlugin from './components/FieldPlugin.vue'

export default {
  components: {
    FieldPluginProvider,
    FieldPlugin,
  },
}
</script>
