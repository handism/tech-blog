<script setup>
import { withBase } from "vitepress"

const props = defineProps(["posts"])

const tagSet = new Set() // タグを格納するためのセット
const tagCount = {}; // タグの個数をカウントするオブジェクト

props.posts.forEach((data) => {
  // tagを配列からセットに格納していく
  if (Array.isArray(data.frontmatter.tags)) {
    data.frontmatter.tags.forEach((tag) => {
      tagSet.add(tag)
      tagCount[tag] = tagCount[tag] ? tagCount[tag] + 1 : 1
  })
  }
})
</script>

<template>
  <ul>
    <li v-for="tag of Array.from(tagSet)">
      <a :href="withBase(`/tag/${tag.toLowerCase().replace(' ', '-')}`)">{{ tag }} ({{ tagCount[tag] }})</a>
    </li>
  </ul>
</template>

<style scoped>

</style>