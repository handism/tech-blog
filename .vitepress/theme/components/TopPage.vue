<!-- ArticleCard.vue -->

<template>
    <div class="article-card">
      <img :src="article.image" alt="Article Thumbnail" class="thumbnail" />
      <h2 class="title">{{ article.title }}</h2>
    </div>
  </template>
  
  <script setup>
  // `defineProps` を使って prop を定義
  const { article } = defineProps(['article']);
  </script>
  
  <style scoped>
  .article-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 16px;
    text-align: center;
  }
  
  .thumbnail {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  
  .title {
    margin-top: 8px;
    font-size: 18px;
  }
  </style>
  