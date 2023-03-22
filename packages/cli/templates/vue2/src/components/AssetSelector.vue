<template>
  <div class="asset-selector">
    <button @click="handleSelectAsset">Select Asset</button>
    <span>Image Url: {{ imageUrl }}</span>
  </div>
</template>

<script>
export default {
  props: {
    selectAsset: {
      type: Function,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageUrl: '',
    }
  },
  methods: {
    handleSelectAsset() {
      this.selectAsset((filename) => {
        this.imageUrl = filename
      })
    },
  },
}
</script>
