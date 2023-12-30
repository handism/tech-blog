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
.footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
}
</style>
  