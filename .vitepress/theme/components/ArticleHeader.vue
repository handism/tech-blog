<script setup>
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
</script>

<template>
  <div class="entry-meta">
    <time v-if="frontmatter.title">{{ new Date(page.lastUpdated).toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"}) }}</time>
    <h1 v-if="frontmatter.title" class="entry-title">{{ frontmatter.title }}</h1>   
    <span v-for="tag in frontmatter.tags" class="tags">
      <a :href="`/tag/${tag}`" class="tag">{{ "# " + tag }}</a>
    </span>
    <img v-if="frontmatter.image" :src="frontmatter.image" class="thumbnail" alt="ブログのサムネイル画像">
  </div>
</template>

<style scoped>

</style>