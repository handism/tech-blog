<template>
  <div>
    <div class="menu-toggle" @click="toggleMenu">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div v-if="isMenuOpen" class="mobile-menu">
      <!-- メニュー項目をここに追加 -->
      <a href="/">Home</a>
      <a href="/about">About</a>
      <!-- 他のメニュー項目を追加 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
/* スタイルは適切に調整してください */
.menu-toggle {
  cursor: pointer;
  display: none; /* ハンバーガーメニューはデフォルトでは非表示 */
}

.bar {
  width: 25px;
  height: 3px;
  background-color: #fff;
  margin: 6px 0;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: #333;
  padding: 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  /* 768px以下の場合にハンバーガーメニューを表示 */
  .menu-toggle {
    display: block;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
