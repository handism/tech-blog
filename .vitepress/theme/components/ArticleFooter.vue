<script setup>
import { data as posts } from './posts.data.mjs'
import { useData } from 'vitepress'
const { page } = useData()
</script>

<template>
  <div class="entry-footer">
    <span class="blog-navigation" v-for="(post, i) in posts">
      <div class="navigation-button previous" v-if="i - 1 in posts && posts[i - 1].frontmatter.title && post.url.replace('/', '') == page.relativePath.replace('.md', '')">
        <a :href="posts[i - 1].url">{{ "<< " + posts[i - 1].frontmatter.title }}</a>
      </div>
      <div class="navigation-button next" v-if="i + 1 in posts && posts[i + 1].frontmatter.title && post.url.replace('/', '') == page.relativePath.replace('.md', '')">
        <a :href="posts[i + 1].url">{{ posts[i + 1].frontmatter.title + " >>" }}</a>
      </div>
    </span>
  </div>
</template>

<style scoped>

</style>