<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <header class="header">
    <h1 class="site-title"><a href="/">{{ theme.siteTitle }}</a></h1>
  </header>
</template>
  
<style scoped>
.header {
  background: var(--gradient-color);
  padding: 1rem;
  text-align: center;
}

.site-title {
  margin: 0;
  padding: 0;
}

.site-title a {
  color: var(--sub-color);
  text-decoration: none;
  font-size: 75%;
}
</style>
  