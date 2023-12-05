<script setup lang="ts">
const emit = defineEmits<{
  (e: 'onIncrease'): void
}>()
const props = defineProps<{ count: number }>()

const onClick = () => {
  emit('onIncrease')
}
</script>

<template>
  <div>
    <h2>Field Value</h2>
    <div
      class="counter-value"
      data-testid="count"
    >
      {{ props.count }}
    </div>
    <button
      class="btn w-full"
      @click="onClick"
    >
      Increment
    </button>
  </div>
</template>
