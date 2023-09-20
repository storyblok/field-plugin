<script setup lang="ts">
const props = defineProps<{ count: number; onIncrease: () => void }>()
</script>

<template>
  <div>
    <h2>Field Value</h2>
    <div class="counter-value">
      {{ props.count }}
    </div>
    <button class="btn w-full" @click="props.onIncrease">
      Increment
    </button>
  </div>
</template>
