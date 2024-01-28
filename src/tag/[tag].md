---
title: タグアーカイブ
---

<script setup>
import { data as posts } from "../../.vitepress/theme/components/posts.data.mjs"
import AllPosts from "../../.vitepress/theme/components/AllPosts.vue"
import { useData } from "vitepress"
const { params } = useData()
const tag = params.value.tag
</script>

<h2>{{ tag }} タグの記事一覧</h2>

<AllPosts :posts="posts" :tag="tag" />
