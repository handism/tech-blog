<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <small>{{ theme.footer.copyright }}</small>
  </footer>
</template>
  
<style scoped>

</style>
  