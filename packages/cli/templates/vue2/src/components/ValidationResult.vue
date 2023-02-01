<template>
  <div class="error" v-if="validationResult.error">
    <p v-for="(detail, index) in validationResult.error.details" :key="index">
      {{ detail.message }}
    </p>
  </div>
</template>

<script lang="ts">
import joi from 'joi';
import type { PropType } from 'vue';

export default {
  name: 'ValidationResult',
  props: {
    model: {
      required: true,
      type: Object as PropType<Record<string, unknown>>,
    },
    schema: {
      required: true,
      type: Object as PropType<joi.Schema>,
    },
  },
  data() {
    return {
      validationResult: {} as joi.ValidationResult,
    };
  },
  watch: {
    model: {
      immediate: true,
      handler(newModel) {
        this.validationResult = this.schema.validate(newModel);
      },
    },
  },
};
</script>

<style>
.error p {
  color: rgb(162, 17, 17);
}
</style>
