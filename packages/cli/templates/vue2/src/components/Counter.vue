<template>
  <div class="increment">
    <button
      class="btn"
      @click="handleIncrement"
    >
      Increment {{ label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    setValue: Function,
    data: Object,
  },
  computed: {
    label() {
      return typeof this.data.value !== 'number'
        ? 0
        : JSON.stringify(this.data.value)
    },
  },
  methods: {
    handleIncrement() {
      this.setValue(
        (typeof this.data.value === 'number' ? this.data.value : 0) + 1,
      )
    },
  },
}
</script>
