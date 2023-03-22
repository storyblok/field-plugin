<template>
  <div class="modal-toggle">
    <button
      type="button"
      @click="handleToggleModal"
    >
      {{ isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>

<script>
export default {
  props: {
    setModalOpen: Function,
    isModalOpen: Boolean,
  },
  methods: {
    handleToggleModal() {
      this.setModalOpen(!this.isModalOpen)
    },
  },
}
</script>
