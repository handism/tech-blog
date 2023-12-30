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
}

/***** メディアクエリ *****/
@media screen and (max-width: 768px) {
  .blog-layout {
    flex-direction: column;
  }
}

@media screen and (min-width: 768px) and (max-width: 1024px) {
}

@media screen and (min-width: 1024px) {
}
</style>
  