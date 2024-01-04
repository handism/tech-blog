<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <small>&copy; {{ new Date().getFullYear() + " " + theme.siteTitle }}</small>
  </footer>
</template>
  
<style scoped>

</style>
  