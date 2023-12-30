<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()
const img = frontmatter.image
</script>

<template>
  <div class="entry-meta">
    <h1 v-if="frontmatter.title">{{ frontmatter.title }}</h1>
    <span v-for="tag in frontmatter.tags" class="tags">
      <a :href="`/tag/${tag}`" class="tag">{{ "# " + tag }}</a>
    </span>
    <img v-if="frontmatter.image" :src="frontmatter.image" class="thumbnail">
  </div>
</template>

<style scoped>

</style>