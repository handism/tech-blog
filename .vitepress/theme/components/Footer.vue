<script setup>
import { useData } from "vitepress"

const { theme } = useData()
</script>

<template>
  <footer class="l-footer">
    <div class="footer-nav">
      <template v-for="item in theme.footerNav">
        <a :href="item.link">{{ item.text }}</a>
      </template>
    </div>
    <small>&copy; {{ new Date().getFullYear() + " " + theme.siteTitle }}</small>
  </footer>
</template>
  
<style scoped>
.l-footer {
  background: var(--gradient-color);
  color: var(--sub-color);
  padding: 1rem;
  text-align: center;
}

.footer-nav a {
  color: var(--sub-color);
  padding: 0 0.7rem 0 0.7rem;
  text-decoration: none;
  font-size: 85%;
}

.footer-nav a+ a {
  border-left: 1px solid;
}

.footer-nav a:hover {
  text-decoration: underline;
}
</style>
  