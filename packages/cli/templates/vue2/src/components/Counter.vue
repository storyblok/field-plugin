<template>
  <div>
    <h2>Field Value</h2>
    <div class="counter-value">
      {{ label }}
    </div>
    <button
      class="btn w-full"
      @click="handleIncrement"
    >
      Increment
    </button>
  </div>
</template>

<script>
export default {
  inject: ['plugin'],
  computed: {
    label() {
      const value = this.plugin.data.value
      return typeof value !== 'number' ? 0 : JSON.stringify(value)
    },
  },
  methods: {
    handleIncrement() {
      const value = this.plugin.data.value
      this.plugin.actions.setValue((typeof value === 'number' ? value : 0) + 1)
    },
  },
}
</script>
