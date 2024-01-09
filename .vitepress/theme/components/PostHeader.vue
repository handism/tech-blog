<script setup>
import { useData } from "vitepress"

const { frontmatter, page } = useData()
</script>

<template>
  <div class="l-post-header">
    <time v-if="frontmatter.tags" class="last-updated">{{ new Date(page.lastUpdated).toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"}) }}</time>
    <h1 v-if="frontmatter.tags" class="post-title">{{ frontmatter.title }}</h1>   
    <span v-for="tag in frontmatter.tags" class="tags">
      <a :href="`/tag/${tag.toLowerCase().replace(' ', '-')}`" class="tag">{{ "# " + tag }}</a>
    </span>
    <img v-if="frontmatter.image" :src="frontmatter.image" class="thumbnail" alt="ブログのサムネイル画像">
  </div>
</template>

<style scoped>
.l-post-header {
  margin: 0 0 0.5rem 0;
  padding: 0;
}

.last-updated {
  font-size: 85%;
  white-space: nowrap;
  margin-left: 0.2rem;
}

.post-title {
  padding-bottom: 0.6rem;
}

.tag {
  font-size: 85%;
  margin: 0 0.5rem 0 0;
  padding: 0.3rem;
  background: var(--accent-color);
  border-radius: 3px;
  white-space: nowrap;
}

.tags a {
  color: var(--sub-color);
  text-decoration: none;
}

.thumbnail {
  max-width: 95%;
  padding: 1.5rem 0 1.5rem 0;
  margin: auto;
  display: block;
}
</style>