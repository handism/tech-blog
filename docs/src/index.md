---
title: トップページ
description: トップページ
next: false
prev: false
lastUpdated: false
---

<script setup>
import { data as posts } from '../.vitepress/theme/posts.data.mjs'
</script>

<ul>
    <li v-for="post of posts">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
    </li>
</ul>
