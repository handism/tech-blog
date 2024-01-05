<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <div class="footer-links">
      <template v-for="item in theme.footerNav">
        <a :href="item.link">{{ item.text }}</a>
      </template>
    </div>
    <small>&copy; {{ new Date().getFullYear() + " " + theme.siteTitle }}</small>
  </footer>
</template>
  
<style scoped>

</style>
  