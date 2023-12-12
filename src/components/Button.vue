<template>
    <button class="custom-button" @click="onClick">
      {{ label }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      }
    },
    methods: {
      onClick() {
        this.$emit('button-click');
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-button {
    /* スタイルを追加 */
  }
  </style>
  