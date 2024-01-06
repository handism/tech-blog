<script setup>
import ArticleHeader from "./ArticleHeader.vue"
import ArticleFooter from "./ArticleFooter.vue"
</script>

<template>
  <div class="main-content">
    <article>
      <ArticleHeader />
      <Content />
      <ArticleFooter />
    </article>
  </div>
</template>
  
<style scoped>
.main-content {
  padding: 0.8rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  overflow-wrap: break-word;
}
</style>
  