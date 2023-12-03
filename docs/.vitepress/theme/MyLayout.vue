<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
const { Layout } = DefaultTheme
const { page, frontmatter } = useData()
const props = defineProps(['title'])
</script>

<template>
  <Layout>
    <template #doc-top>
        <h1>{{frontmatter.title}}</h1>
        <p>カテゴリ：{{page.filePath.split("/")[0]}}</p>
        <p>最終更新日時：{{new Date(page.lastUpdated).toLocaleString("ja-JP")}}</p>
    </template>
  </Layout>
</template>

<style scoped>

</style>