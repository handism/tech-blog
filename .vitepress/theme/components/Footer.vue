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
.footer {
  background: var(--gradient-color);
  color: var(--sub-color);
  padding: 1rem;
  text-align: center;
}

.footer-links a {
  color: var(--sub-color);
  padding: 0 0.7rem 0 0.7rem;
  text-decoration: none;
  font-size: 85%;
}

.footer-links a+ a {
  border-left: 1px solid;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
  