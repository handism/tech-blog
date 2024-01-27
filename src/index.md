---
titleTemplate: :title
---

<script setup>
import { data as posts } from "../.vitepress/theme/components/posts.data.mjs"
import { withBase } from "vitepress"
</script>

<style scoped>
.post-card-container {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 0 auto;
}

.post-card {
  width: calc(33.33% - 32px);
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  text-align: center;
  box-sizing: border-box;
  text-decoration: none;
  display: flex;
  flex-direction: column;
}

.thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  mix-blend-mode: normal;
  transition: .5s; 
}

.thumbnail:hover {
  mix-blend-mode: var(--mix-brend-mode);
}

.post-title {
  margin: 0;
  padding: 0;
  margin-top: 8px;
  font-size: 16px;
  border: none;
}

@media (max-width: 767px) {
  .post-card-container {
    flex-direction: column;
    align-items: stretch;
  }

  .post-card {
    width: 90%;
  }
}
</style>


![トップ画像](./public/site-image2.webp)

`Handism's Tech Blog`は、現役の企業内クラウドインフラエンジニアによる技術ブログです。

日々の業務やプライベートで得た知識の備忘録として運用しています。

## 新着記事

<div class="post-card-container">
  <template v-for="post of posts.splice(0, 9)">
    <a :href="withBase(post.url)" class="post-card">
      <img :src="post.frontmatter.image" alt="Post Thumbnail" class="thumbnail" width="2688" height="1536" />
      <h2 class="post-title">{{ post.frontmatter.title }}</h2>
    </a>
  </template>
</div>