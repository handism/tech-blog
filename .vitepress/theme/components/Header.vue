<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <header class="header">
    <a :href="`/`">
      <h1 class="site-title">{{ theme.siteTitle }}</h1>
    </a>
    <!-- Add more header content as needed -->
  </header>
</template>
  
<style scoped>
.header {
  background-color: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  text-decoration: none;
}

.site-title {
  color: #fff;
}
</style>
  