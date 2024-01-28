---
titleTemplate: :title
---

<script setup>
import { data as posts } from "../.vitepress/theme/components/posts.data.mjs"
import NewPosts from "../.vitepress/theme/components/NewPosts.vue"
</script>

![トップ画像](./public/site-image2.webp)

`Handism's Tech Blog`は、現役の企業内クラウドインフラエンジニアによる技術ブログです。

日々の業務やプライベートで得た知識の備忘録として運用しています。


## 新着記事

<NewPosts :posts="posts" />