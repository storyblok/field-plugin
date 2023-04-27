<template>
  <div class="asset-selector">
    <button
      class="btn"
      @click="handleSelectAsset"
    >
      Select Asset
    </button>
    <span>Image Url: {{ asset?.filename }}</span>
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
      asset: undefined,
    }
  },
  methods: {
    async handleSelectAsset() {
      this.asset = await this.selectAsset()
    },
  },
}
</script>
