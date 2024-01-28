<script setup>
import { withBase } from "vitepress"

const props = defineProps(["posts", "tag"])
</script>

<template>
  <ul>
    <template v-for="post of posts">
      <li v-if="!tag || post.frontmatter.tags.some(t => t.toLowerCase().replace(' ', '-') == tag)">
        <a :href="withBase(post.url)">{{ post.frontmatter.title }}</a>
      </li>
    </template>
  </ul>
</template>

<style scoped>

</style>