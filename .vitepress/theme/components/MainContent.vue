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
  flex-grow: 1;
  padding: 20px;
  box-sizing: border-box;
  width: 95%;
  margin: 0 auto;
  justify-content: center;
  max-width: 800px;
}
</style>
  