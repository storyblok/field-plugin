<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'

const plugin = useFieldPlugin()
</script>

<template>
  <pre>
    {{ JSON.stringify(plugin, null, 2) }}
  </pre>
</template>
