<template>
    <div v-if="isVisible" class="custom-alert">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      },
      isVisible: {
        type: Boolean,
        default: false
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-alert {
    /* スタイルを追加 */
  }
  </style>
  