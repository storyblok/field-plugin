<template>
  <div>
    <h2>Field Value</h2>
    <div class="counter-value">
      {{ count }}
    </div>
    <button
      class="btn w-full"
      @click="onIncrease"
    >
      Increment
    </button>
  </div>
</template>

<script>
export default {
  props: ['count', 'onIncrease'],
}
</script>
