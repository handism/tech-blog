<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <div class="footer-links">
      <a href="/about">このブログについて</a>|
      <a href="">サイトマップ</a>|
      <a href="">プライバシーポリシー</a>
    </div>
    <small>&copy; {{ new Date().getFullYear() + " " + theme.siteTitle }}</small>
  </footer>
</template>
  
<style scoped>

</style>
  