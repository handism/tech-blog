<script setup>
import PostHeader from "./PostHeader.vue"
import PostFooter from "./PostFooter.vue"
</script>

<template>
  <div class="l-main">
    <article>
      <PostHeader />
      <div class="l-content">
        <Content />
      </div>
      <PostFooter />
    </article>
  </div>
</template>
  
<style scoped>
.l-main {
  padding: 0.8rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  overflow-wrap: break-word;
}
</style>