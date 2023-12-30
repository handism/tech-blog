---
title: VitePressで作った技術ブログをVuetifyでカスタマイズする
tags: [vue, vitepress, frontend]
---

## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* VitePressのバージョン：v1.0.0-rc.30
* 既にVitePressが構築できていることが前提
* Macを使用


## やりたいこと
前回、VitePressで技術ブログを自作したものの、まだまだ足りていない部分があるので追加していく。  

まずは、記事上部のタイトル表示をかっこよくし、カテゴリのリンクを表示するようにしたい。  
    
VitePressにはデフォルトテーマを拡張する機能があるとのこと。  
今回はこれを利用する。  
参考：https://vitepress.dev/guide/extending-default-theme 


## Vuetifyのインストール
https://vuetifyjs.com/en/getting-started/installation/#installation  
↑公式ページを参考に。  
  
今回はnpmでインストールする。  
Vueのプロジェクトにcdし、ターミナルから以下を叩く。  
  
```zsh
npm install vuetify
```
  
これでインストールが完了。  


## Vuetifyの利用方法
VitePressでVuetifyを利用するには、`.vitepress/theme/index.ts`に以下を追加する。

```ts
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import './style.css'

const vuetify = createVuetify({
  components,
  directives,
  ssr: true,
})
```
  
また、`export default`内にも`app.use(vuetify)`を追加する。  
  
```ts{5}
export default {
  extends: DefaultTheme,
  Layout: MyLayout,
  enhanceApp({ app, router, siteData }) {
    app.use(vuetify) // ←追加
  }
} satisfies Theme
```
  
これだけだと`npm run docs:build`時に以下のようなエラーが出てしまう…
  
```
build error:
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".css" for /xxx/node_modules/vuetify/lib/components/VCode/VCode.css
```
  
これを解消するためには、`.vitepress/config.mts`の`defineCongig`の中に以下を追加すればOK。  
  
```ts
 vite: {
    ssr: {
      noExternal: ["vuetify"]
    }
  },
```

これでVitePress内でVuetifyを利用するための準備が整った。


## Vuetifyで記事ページのタイトルとカテゴリを装飾する
で、ここからがやっと本題。  
記事ページにタイトルとカテゴリをいい感じに表示するコンポーネントを作成する。

```vue
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
          <v-btn size="small" rounded="xl" class="text-capitalize ml-5 mb-8">{{page.filePath.split("/")[0]}}</v-btn>
        </a>
        </span>
    </template>
  </Layout>
</template>
```
  
こんな感じで記事ページの上部がかっこ良くなった。

::: tip
`<template #doc-top>`の部分はVitePressのデフォルトテーマに備わっている「レイアウトスロット」という機能。  
ページ内の特定の場所にコンポーネントを注入できる。  
  
https://vitepress.dev/guide/extending-default-theme#layout-slots
:::