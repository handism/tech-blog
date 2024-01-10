---
titleTemplate: :title
---

<script setup>
import { data as posts } from '../.vitepress/theme/components/posts.data.mjs'

const tagSet = new Set() // タグを格納するためのセット

posts.forEach((data) => {
  // tags:がある場合は配列からセットに格納していく
  if (data.frontmatter && data.frontmatter.tags && Array.isArray(data.frontmatter.tags)) {
    data.frontmatter.tags.forEach((tag) => tagSet.add(tag))
  }
})
</script>

<style scoped>
.article-card-container {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 0 auto;
}

.article-card {
  width: calc(33.33% - 32px);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  mix-blend-mode: normal;
  transition: .5s; 
}

.thumbnail:hover {
  mix-blend-mode: var(--mix-brend-mode);
}

.title {
  margin: 0;
  padding: 0;
  margin-top: 8px;
  font-size: 16px;
  border: none;
}

@media (max-width: 767px) {
  .article-card-container {
    flex-direction: column;
    align-items: stretch;
  }

  .article-card {
    width: 90%;
  }
}
</style>


<div class="article-card-container">
<template v-for="post of posts">
    <a :href=post.url class="article-card">
      <img :src="post.frontmatter.image" alt="Article Thumbnail" class="thumbnail" />
      <h2 class="title">{{ post.frontmatter.title }}</h2>
    </a>
</template>
</div>