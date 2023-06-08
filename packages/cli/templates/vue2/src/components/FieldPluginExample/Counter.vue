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
      const content = this.plugin.data.content
      return typeof content !== 'number' ? 0 : JSON.stringify(content)
    },
  },
  methods: {
    handleIncrement() {
      const content = this.plugin.data.content
      this.plugin.actions.setContent(
        (typeof content === 'number' ? content : 0) + 1,
      )
    },
  },
}
</script>
