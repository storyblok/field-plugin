<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

const props = defineProps<{
  selectAsset: PluginActions['selectAsset']
  data: PluginState
}>()

const imageUrl = ref('')

const handleSelectAsset = () => {
  props.selectAsset((filename) => (imageUrl.value = filename))
}
</script>

<template>
  <div className="asset-selector">
    <button
      class="btn"
      @click="handleSelectAsset"
    >
      Select Asset
    </button>
    <span>Image Url: {{ imageUrl }}</span>
  </div>
</template>
