<template>
    <label class="custom-toggle">
      <input type="checkbox" v-model="isChecked" @change="onToggle">
      <span class="slider"></span>
    </label>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isChecked: false
      };
    },
    methods: {
      onToggle() {
        this.$emit('toggle-change', this.isChecked);
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-toggle {
    /* スタイルを追加 */
  }
  
  .slider {
    /* スタイルを追加 */
  }
  </style>
  