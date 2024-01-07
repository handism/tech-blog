<script setup>
import { data as posts } from "./posts.data.mjs"
import { useData } from "vitepress"
const { page } = useData()
</script>

<template>
  <div class="l-post-footer">
    <div class="post-nav">
      <template v-for="(post, i) in posts">
        <a class="previous-post" v-if="i - 1 in posts && posts[i - 1].frontmatter.tags && post.url.replace('/', '') == page.relativePath.replace('.md', '')" :href="posts[i - 1].url">{{ "<< " + posts[i - 1].frontmatter.title }}</a>
      </template>
      <div class="nav-cushion"></div>
      <template v-for="(post, i) in posts">
        <a class="next-post" v-if="i + 1 in posts && posts[i + 1].frontmatter.tags && post.url.replace('/', '') == page.relativePath.replace('.md', '')" :href="posts[i + 1].url">{{ posts[i + 1].frontmatter.title + " >>" }}</a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.l-post-footer {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.post-nav {
  display: table;
  width: 100%;
  box-sizing: border-box;
}

.post-nav a {
  font-size: 0.8rem;
  text-decoration: none;
  background: var(--accent-color);
  color: var(--sub-color);
  transition: background-color 0.3s, color 0.3s;
  border-radius: 5px;
  padding: 0.5rem 1rem;
}

.post-nav a:hover {
  background: var(--sub-color);
  color: var(--accent-color);
}

.previous-post {
  display: table-cell;
  vertical-align: middle;
  text-align: left;
  width: 45%;
}

.nav-cushion {
  width: 10%;
}

.next-post {
  width: 45%;
  display: table-cell;
  vertical-align: middle;
  text-align: right;
}
</style>