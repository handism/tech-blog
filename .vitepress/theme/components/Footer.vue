<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <div class="footer-links">
      <a href="/about">about</a>|
      <a href="">sitemap</a>|
      <a href="">privacy policy</a>
    </div>
    <small>&copy; {{ new Date().getFullYear() + " " + theme.siteTitle }}</small>
  </footer>
</template>
  
<style scoped>

</style>
  