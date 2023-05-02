<template>
  <FieldPluginProvider>
    <template v-slot:loading><span>Loading...</span></template>
    <template v-slot:error><span>Error</span></template>

    <p>loaded</p>
  </FieldPluginProvider>
</template>

<script>
import './style.css'
import FieldPluginProvider from './components/FieldPluginProvider.vue'

export default {
  components: {
    FieldPluginProvider,
  },
}
</script>
