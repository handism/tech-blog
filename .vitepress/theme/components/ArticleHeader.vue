<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const img = frontmatter.image
</script>

<template>
  <div class="entry-meta">
    <h1>{{ frontmatter.title }}</h1>
    <span v-for="tag in frontmatter.tags" class="tags">
      <a :href="`/tag/${tag}`" class="tag">{{ "#" + tag }}</a>
    </span>
    <img v-if="frontmatter.image" :src="frontmatter.image" class="thumbnail">
  </div>
</template>

<style scoped>
.tag {
  font-size: 85%;
  margin: 0 0.5rem 0 0;
  padding: 0.3rem;
  background: #0f5373;
  border-radius: 3px;
  color: #fff;
}

.thumbnail {
  max-width: 95%;
  padding: 1.5rem 0 1.5rem 0;
  margin: auto;
  display: block;
}
</style>