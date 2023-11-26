---
title: VitePress + GitHub Actions + GitHub Pagesで技術ブログを自作する
description: VitePress + GitHub Actions + GitHub Pagesで技術ブログを自作する
---

# {{ $frontmatter.title }}

[[toc]]

## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* VitePressのバージョン：v1.0.0-rc.30
* 既にVueプロジェクトができていることが前提
* Macを使用


## ①VitePressの構築
既存のVueプロジェクトにcdしてから以下コマンドを入力。

```zsh
npm add -D vitepress
npx vitepress init
```
選択肢では以下を入力した。

* ./docs
* handism-tech-blog
* handism’s tech blog
* Default Theme + Customization
* Yes
* Yes

.gitignoreに以下を追加

```
docs/.vitepress/dist
docs/.vitepress/cache
```

### 動作確認の手順

* 開発時
```zsh
npm run docs:dev
```
http://localhost:5173/

* リリース時
```zsh
npm run docs:build
```

* 出力ディレクトリ：docs/.vitepress/dist

```zsh
npm run docs:preview
```

http://localhost:4173


## ② GitHub Pagesにデプロイする
参考：https://vitepress.dev/guide/deploy#github-pages  
static.ymlをそのまま貼り付けるだけ。コミットすれば自動でデプロイが開始される。  
これでブログが完成！簡単すぎる。


## ③ 記事の作成
まずはブログが寂しいので記事を増やす。  
VitePressの記事の管理は、docsフォルダ内にマークダウン形式（*.md）のファイルを作成/更新/削除していくことで実施可能。  
gatsby.js時代にも技術ブログを作っていたので、その時に作ったmdファイル3つを流用。

### mdファイルの作り方
mdファイルのフォーマットはなるべく統一したいので、一旦以下で作成。

::: tip
上の部分はFrontmatterという。
:::

```md
---
title: 記事タイトル
description: 記事の概要
next: false
prev: false
---

## {{ $frontmatter.title }}

[[toc]]
```

いったん持たせたい要素はこれだけとする。  
thumbnail:を持たせようかと思ったけど技術ブログにサムネイルなんて要るかな？ってことで不要とした。  
category:を持たせてもいいんだけど、公式が「ファイルベースのルーティング」を謳っているのでそれに沿う形で。 
tag:はあると便利なんだけど扱いが大変そうなので一旦はなしの方向で…。  

::: warning
(!) Found dead link http://localhost:5173 in file vue-js.md と出てビルドがエラーとなってしまう。
config.mtsに以下を追加すると解決。
  ignoreDeadLinks: "localhostLinks",
:::


### フォルダ整理
docsフォルダ以下にmdファイルをベタ置きしていくのもあれなので、フォルダを整理する。

docs/srcフォルダとdocs/src/publicフォルダを作成。  
srcの下にカテゴリ別にフォルダ分けしていく。  
カテゴリごとにindex.mdを置いていく。  

## ④ブログの設定
### config.mtsファイルの修正（サイトの設定）
以下を追加する。

```ts
  srcDir: "./src",
  lang: "ja-JP",
  cleanUrls: true,
  srcExclude: ["**/README.md", "**/TODO.md"],
  head: [["link", {rel: "icon", href: "/favicon.ico"}]],
  lastUpdated: true,
```

### config.mtsファイルの修正（レイアウトの設定）
themeConfig:の中に以下を追加＆修正。  
上から、タイトル横のロゴマーク、ナビゲーションバー、フッタ、最終更新日時、検索バー、ページャーの設定。

::: warning
※2023/11/25現在、サイドバーが表示されている場合はフッタが表示されないらしい。
:::

```ts
    logo: "/sample.jpg",
    nav: [
      { text: 'Home', link: '/' },
      { text: 'about', link: '/about' },
      { text: 'frontend', link: '/frontend' },
      { text: 'sample', link: '/sample' }
    ],
    footer: {
      copyright: "©︎ 2023"
    },
    lastUpdated: {
      text: "最終更新日時",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium"
      }
    },
    search: {
      provider: "local"
    },
    docFooter: {
      prev: "前の記事",
      next: "次の記事"
    },
```

::: tip
md内に書いたソースコードがビルドエラーとなってしまう場合は、コードを以下のように囲んでエスケープする。
````md
```md

```
````
:::


## ⑤記事一覧の作成
今のところVitePressには、デフォルトで記事一覧の機能がないので自作する。  
参考：https://vitepress.dev/guide/data-loading#createcontentloader

/docs/.vitepress/themeに「posts.data.mjs」を作成。

```js
// posts.data.js
import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
    includeSrc: false,
    transform(rawData) {
        return rawData
            .filter(page => !page.url.endsWith("/"))
            .sort((a, b) => {
                return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
            })
    }
})
```

ブログトップページのindex.mdはこんな感じのスクリプトを追加する。

```md
<script setup>
import { data as posts } from '../.vitepress/theme/posts.data.mjs'
</script>

<ul>
    <li v-for="post of posts">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
    </li>
</ul>
```

他のカテゴリページのindex.mdはこんな感じにしてみた。  
URLがカテゴリ名で始まった場合のみリスト化。

```md
<script setup>
import { data as posts } from '../../.vitepress/theme/posts.data.mjs'
</script>

<ul>
    <template v-for="post of posts">
        <li v-if="post.url.startsWith('/frontend/')">
            <a :href="post.url">{{ post.frontmatter.title }}</a>
        </li>
    </template>
</ul>
```