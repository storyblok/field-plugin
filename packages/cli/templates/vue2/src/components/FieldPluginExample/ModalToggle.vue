<template>
  <div>
    <h2>Modal</h2>
    <button
      class="btn w-full"
      type="button"
      @click="() => setModalOpen(!isModalOpen)"
    >
      {{ isModalOpen ? 'Close' : 'Open' }} modal
    </button>
  </div>
</template>

<script>
export default {
  props: ['isModalOpen', 'setModalOpen'],
}
</script>
