<template>
  <pre>{{ JSON.stringify(plugin, null, 2) }}</pre>
</template>

<script>
import { fieldPluginMixin } from '../fieldPlugin'
export default {
  mixins: [fieldPluginMixin],
}
</script>
