---
titleTemplate: :title
---

<script setup>
import { data as posts } from "../.vitepress/theme/components/posts.data.mjs"
import NewPosts from "../.vitepress/theme/components/NewPosts.vue"
</script>

<style scoped>
.example {
  position: relative;
}

.example p {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  margin: 0;
  padding: 0;
  color: #e8eaed;
}

.example img {
  width: 100%;
  height: 200px;
  mix-blend-mode: overlay;
  object-fit: cover;
}
</style>


<div class="example">
  <img src="./public/site-image.webp" />
  <p>現役のインハウスエンジニアによる技術ブログ</p>	
</div>


## 新着記事

<NewPosts :posts="posts" />