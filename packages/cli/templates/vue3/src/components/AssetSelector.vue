<script setup lang="ts">
import { ref } from 'vue'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

const props = defineProps<{
  selectAsset: PluginActions['selectAsset']
  data: PluginState
}>()

const imageUrl = ref('')

const handleSelectAsset = async () => {
  imageUrl.value = await props.selectAsset()
}

const removeAsset = async () => {
  imageUrl.value = ''
}
</script>

<template>
  <div>
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

<style>
img {
  width: 100%;
  display: block;
  margin-bottom: 1rem;
}
</style>
