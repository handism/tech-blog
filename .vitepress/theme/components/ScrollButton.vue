<script>
export default {
  data() {
    return {
        showScrollButton: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.showScrollButton = window.scrollY > 100;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<template>
  <div>
    <button v-show="showScrollButton" @click="scrollToTop" class="scroll-top-button">
      Top
    </button>
  </div>
</template>

<style scoped>

</style>