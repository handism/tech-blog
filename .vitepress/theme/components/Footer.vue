<script setup>
import { useData } from 'vitepress'

const { theme } = useData()
</script>

<template>
  <footer class="footer">
    <small>{{ theme.footer.copyright }}</small>
    <!-- Add more footer content as needed -->
  </footer>
</template>
  
<style scoped>

</style>
  