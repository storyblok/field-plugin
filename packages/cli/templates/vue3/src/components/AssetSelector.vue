<script setup lang="ts">
import { ref } from 'vue'
import { useFieldPluginLoaded } from '../useFieldPlugin'

const plugin = useFieldPluginLoaded()

const imageUrl = ref('')

const handleSelectAsset = async () => {
  imageUrl.value = await plugin.value.actions.selectAsset()
}

const removeAsset = async () => {
  imageUrl.value = ''
}
</script>

<template>
  <div class="asset-selector">
    <h2>Asset Selector</h2>
    <img
      :src="imageUrl"
      v-if="imageUrl"
    />
    <button
      v-if="imageUrl"
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
