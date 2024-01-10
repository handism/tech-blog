---
title: サイトマップ
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


## 記事一覧

<ul>
  <li v-for="post of posts">
    <a :href="post.url">{{ post.frontmatter.title }}</a>
  </li>
</ul>


## タグ一覧

<ul>
  <li v-for="tag of Array.from(tagSet)">
    <a :href="'/tag/' + tag.toLowerCase().replace(' ', '-')">{{ tag }}</a>
  </li>
</ul>
