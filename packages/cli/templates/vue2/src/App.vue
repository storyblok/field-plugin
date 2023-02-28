<template>
  <div class="container">
    <div class="buttons">
      <button type="button" @click="toggleModal()">Toggle modal</button>
    </div>
    <form @submit.prevent="submit" aria-label="form">
      <label for="name">Your name??</label>
      <input
        v-model="name"
        name="name"
        aria-label="name"
        placeholder="Enter your name:"
      />
      <button type="submit">Save</button>
    </form>
    <ValidationResult :model="modelForValidation" :schema="schema" />
  </div>
</template>

<script lang="ts">
import joi from 'joi';
import ValidationResult from './components/ValidationResult.vue';
import './style.css';
import { createFieldPlugin } from '@storyblok/field-plugin';

export default {
  components: { ValidationResult },
  data() {
    return {
      actions: undefined,
      cleanupSideEffects: undefined,
      name: '',
      schema: joi.object({
        name: joi.string().min(3).max(6).required(),
        _uid: joi.string(),
        plugin: joi.string(),
      }),
    };
  },
  computed: {
    modelForValidation() {
      return {
        name: this.name,
      };
    },
  },
  created() {
    //TODO: Clean up the onUpdate argument inside createFieldType
    const [actions, cleanupSideEffects] = createFieldPlugin((args) =>
      console.log(args)
    );
    this.actions = actions;
    this.cleanupSideEffects = cleanupSideEffects;
  },
  destroyed() {
    this.cleanupSideEffects();
  },

  methods: {
    submit() {
      this.actions.setValue({ name: this.name });
    },
  },
};
</script>

<style scoped>
.buttons {
  display: flex;
  gap: 1rem;
}

form {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

input {
  padding: 0.5rem 1rem;
  width: 100%;
}
</style>
