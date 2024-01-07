<template>
  <div>
    <button v-show="showScrollButton" @click="scrollToTop" class="scroll-button">
      Top
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
        showScrollButton: false
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.showScrollButton = window.scrollY > 100;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  }
}
</script>

<style scoped>
.scroll-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px;
  background-color: var(--accent-color);
  color: var(--sub-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  mix-blend-mode: var(--mix-brend-mode);
}
</style>