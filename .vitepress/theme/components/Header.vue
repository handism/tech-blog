<script setup>
import { useData, withBase } from "vitepress"

const { theme } = useData()
</script>

<template>
  <header class="l-header">
    <h1 class="site-title"><a :href="withBase('/')">{{ theme.siteTitle }}</a></h1>
  </header>
</template>
  
<style scoped>
.l-header {
  background: var(--accent-color);
  padding: 1rem;
  text-align: center;
}

.site-title a {
  color: var(--sub-color);
  text-decoration: none;
  font-size: 75%;
}
</style>