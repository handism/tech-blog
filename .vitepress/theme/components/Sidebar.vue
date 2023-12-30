<script setup>
// import tagList from './get-taglist' 
</script>

<template>
    <aside class="sidebar">
      <h2>Sidebar</h2>
      <!-- Add more sidebar content as needed -->
      <!-- <div class="tags">
        <span class="tag" v-for="tag in tagList">
          <a :href="`/tag/${tag}`">
            <v-btn size="small" rounded="xl" class="text-lowercase ml-5 mb-8">{{ "#" + tag }}</v-btn>
            </a>
        </span>
      </div> -->
    </aside>
  </template>
  

  
  <style scoped>
  .sidebar {
    width: 30%;
    min-width: 200px;
    background-color: #f0f0f0;
    padding: 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
    }
  }
  </style>
  