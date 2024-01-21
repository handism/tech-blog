---
title: サイトマップ
---

<script setup>
import { data as posts } from "../.vitepress/theme/components/posts.data.mjs"
import { withBase } from "vitepress"

const tagSet = new Set() // タグを格納するためのセット
const tagCount = {}; // タグの個数をカウントするオブジェクト

posts.forEach((data) => {
  // tags:がある場合は配列からセットに格納していく
  if (data.frontmatter && data.frontmatter.tags && Array.isArray(data.frontmatter.tags)) {
    data.frontmatter.tags.forEach((tag) => {
      tagSet.add(tag)
      tagCount[tag] = tagCount[tag] ? tagCount[tag] + 1 : 1
  })
  }
})
</script>


## 記事一覧

<ul>
  <li v-for="post of posts">
    <a :href="withBase(post.url)">{{ post.frontmatter.title }}</a>
  </li>
</ul>


## タグ一覧

<ul>
  <li v-for="tag of Array.from(tagSet)">
    <a :href="withBase(`/tag/${tag.toLowerCase().replace(' ', '-')}`)">{{ tag }} ({{ tagCount[tag] }})</a>
  </li>
</ul>
