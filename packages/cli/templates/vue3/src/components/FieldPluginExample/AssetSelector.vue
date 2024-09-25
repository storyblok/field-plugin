<script setup lang="ts">
import { ref } from 'vue'
import type { Asset, SelectAsset } from '@storyblok/field-plugin'

const props = defineProps<{ selectAsset: SelectAsset }>()

const asset = ref<Asset>()

const handleSelectAsset = async () => {
  asset.value = await props.selectAsset()
}

const removeAsset = () => {
  asset.value = undefined
}
</script>

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
