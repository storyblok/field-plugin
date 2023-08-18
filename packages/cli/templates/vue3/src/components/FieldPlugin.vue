<script setup lang="ts">
import { useFieldPlugin } from '@storyblok/field-plugin/vue3'

const plugin = useFieldPlugin()
</script>

<template>
  <pre>
    {{ JSON.stringify(plugin, null, 2) }}
  </pre>
</template>
