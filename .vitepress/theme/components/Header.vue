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

</style>
  