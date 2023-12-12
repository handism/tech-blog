<template>
    <div class="custom-modal" v-if="isVisible">
      <div class="modal-content">
        <slot></slot>
        <button @click="closeModal">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isVisible: false
      };
    },
    methods: {
      openModal() {
        this.isVisible = true;
      },
      closeModal() {
        this.isVisible = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .custom-modal {
    /* スタイルを追加 */
  }
  
  .modal-content {
    /* スタイルを追加 */
  }
  </style>
  