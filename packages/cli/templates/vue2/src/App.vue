<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <FieldPluginExample />
  </FieldPluginProvider>
</template>

<script>
import FieldPluginProvider from './components/FieldPluginProvider.vue'
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
