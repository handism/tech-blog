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
        <p>
          <p>
            <h1 class="text-h5">{{frontmatter.title}}</h1>
          </p>
    
        <p>
          <v-col cols="auto">
            <v-btn size="small" rounded="xl">{{page.filePath.split("/")[0]}}</v-btn>
          </v-col>
        </p>

      </p>
    </template>
  </Layout>
</template>

<style scoped>

</style>