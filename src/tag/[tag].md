---
title: タグアーカイブ
---

<script setup>
import { data as posts } from '../../.vitepress/theme/components/posts.data.mjs'
import { withBase, useData } from "vitepress"
const { params } = useData()
const tag = params.value.tag
</script>

<h2>{{ tag }} タグの記事一覧</h2>
<ul>
    <template v-for="post of posts">
        <li v-if="post.frontmatter.tags && post.frontmatter.tags.some(t => t.toLowerCase().replace(' ', '-') == tag)">
            <a :href="withBase(post.url)">{{ post.frontmatter.title }}</a>
        </li>
    </template>
</ul>
