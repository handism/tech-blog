<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { page, frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-top>
      <h1 class="text-h5 ma-5">{{frontmatter.title}}</h1>
      <span v-if="!page.filePath.includes('index.md')">
        <a :href="`/${page.filePath.split('/')[0]}`">
          <v-btn size="small" rounded="xl" class="text-lowercase ml-5 mb-8">{{page.filePath.split("/")[0]}}</v-btn>
        </a>
        </span>
    </template>
  </Layout>
</template>

<style scoped>

</style>