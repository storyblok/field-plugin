<template>
  <pre>{{ JSON.stringify(plugin, null, 2) }}</pre>
</template>

<script>
export default {
  inject: ['plugin'],
}
</script>
