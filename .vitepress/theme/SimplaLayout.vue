<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    Header,
    // Sidebar,
    MainContent,
    Footer,
  },
}
</script>

<template>
  <Header />
  <div class="blog-layout">
    <Sidebar />
    <MainContent />
  </div>
  <Footer />
</template>
  
<style scoped>
.blog-layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
  
@media (max-width: 768px) {
  .blog-layout {
    flex-direction: column;
  }
}
</style>
  