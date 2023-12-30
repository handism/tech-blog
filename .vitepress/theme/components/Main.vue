<script setup>
import ArticleHeader from "./ArticleHeader.vue"
</script>

<template>
  <div class="main-content">
    <article>
      <!-- Add more article content as needed -->
      <ArticleHeader />
      <Content />
    </article>
  </div>
</template>
  
<style scoped>
.main-content {
  padding: 0.8rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  overflow-wrap: break-word;
}
</style>
  