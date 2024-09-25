<template>
  <div class="asset-selector">
    <h2>Asset Selector</h2>
    <img
      v-if="asset"
      :src="asset.filename"
      title="Selected Asset"
    >
    <button
      v-if="asset"
      class="btn w-full"
      @click="removeAsset"
    >
      Remove Asset
    </button>
    <button
      v-else
      class="btn w-full"
      @click="handleSelectAsset"
    >
      Select Asset
    </button>
  </div>
</template>

<script>
export default {
  props: ['selectAsset'],
  data() {
    return {
      asset: undefined,
    }
  },
  methods: {
    async handleSelectAsset() {
      this.asset = await this.selectAsset()
    },
    removeAsset() {
      this.asset = undefined
    },
  },
}
</script>
