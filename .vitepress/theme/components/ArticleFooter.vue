<script setup>
import { data as posts } from './posts.data.mjs'
import { useData } from 'vitepress'
const { page } = useData()
</script>

<template>
  <div class="entry-footer">
    <div class="blog-navigation" v-for="(post, i) in posts">
      <a class="previous-post" v-if="i - 1 in posts && posts[i - 1].frontmatter.title && post.url.replace('/', '') == page.relativePath.replace('.md', '')" :href="posts[i - 1].url">{{ "<< " + posts[i - 1].frontmatter.title }}</a>
      <a class="next-post" v-if="i + 1 in posts && posts[i + 1].frontmatter.title && post.url.replace('/', '') == page.relativePath.replace('.md', '')" :href="posts[i + 1].url">{{ posts[i + 1].frontmatter.title + " >>" }}</a>
    </div>
  </div>
</template>

<style scoped>

</style>