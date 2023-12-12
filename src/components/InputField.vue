<template>
    <input v-model="inputValue" class="custom-input" @input="onInput">
  </template>
  
  <script>
  export default {
    data() {
      return {
        inputValue: ''
      };
    },
    methods: {
      onInput() {
        this.$emit('input-change', this.inputValue);
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-input {
    /* スタイルを追加 */
  }
  </style>
  