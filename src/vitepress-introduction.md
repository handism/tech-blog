---
title: VitePress + GitHub Actions + GitHub Pagesで技術ブログを自作する
tags: [frontend, vue, vitepress]
image: symbol-mark.webp
---

## 何故やるのか
ITエンジニアとして働いていて、毎日が勉強だと感じている。学んだことは技術メモとして残しておきたいと考えているが、あまりお金をかけずに済む方法はないものか…と考えていた。

他には無料ブログサービス（Blogger、はてなブログ、Qiita、Zenn等）を利用するなどの選択肢があるが、せっかくなので自分にない技術の勉強も兼ねて自作したい。

::: tip
VitePressの名前に含まれている「`Vite`」とは、Vue.jsのコマンドラインツールのこと。  
読み方は「ヴィート」。フランス語で「高速」という意味で、名前の通りプロジェクト生成や実行が高速という特徴がある。
:::


## 要件
* 技術メモはMarkdownで記載したい
* 技術ブログの見た目もできれば出来合いのものではなく、CSSを自作したい
* ビルド＆デプロイはGitHub Actionsで自動で行いたい
* ホスティングは無料なのでGitHub Pagesで行いたい
  * サイトの種類は3つあって、プロジェクト、ユーザ、Organization
  * 今回は`https://[username].github.io`でアクセスしたいのでユーザーサイトを使う


## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* VitePressのバージョン：v1.0.0-rc.30
* 既にVueプロジェクトができていることが前提
* Macを使用


## ①VitePressの構築
既存のVueプロジェクトに`cd`してから以下コマンドを入力。

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

`.gitignore`に以下を追加

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

* 出力ディレクトリ：`docs/.vitepress/dist`

```zsh
npm run docs:preview
```

http://localhost:4173


## ② GitHub Pagesへのデプロイ
参考：https://vitepress.dev/guide/deploy#github-pages  

### GitHub上のリポジトリのページにアクセス
* Settings＞Pages
* SourceをGitHub Actionsに変更
* staticをクリック

`.github/workflows`にある`static.yml`の内容を以下に変更する。コミットすれば自動でデプロイが開始される。  

```yml
# Sample workflow for building and deploying a VitePress site to GitHub Pages
#
name: Deploy VitePress site to Pages

on:
  # Runs on pushes targeting the `main` branch. Change this to `master` if you're
  # using the `master` branch as the default branch.
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Not needed if lastUpdated is not enabled
      # - uses: pnpm/action-setup@v2 # Uncomment this if you're using pnpm
      # - uses: oven-sh/setup-bun@v1 # Uncomment this if you're using Bun
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm # or pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Install dependencies
        run: npm ci # or pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: |
          npm run docs:build # or pnpm docs:build / yarn docs:build / bun run docs:build
          touch docs/.vitepress/dist/.nojekyll
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: docs/.vitepress/dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

これでブログが完成！簡単すぎる。

### 動作確認
ここまでの作業が終わったらGitにコミットしてみる。ビルドとデプロイが自動で走って、`https://[username].github.io`でサイトが見られれば成功！

::: tip
デプロイに失敗する場合  
Settings>Environmentsの「`github-pages`」っていう保護ルールを確認。  
`Deployment branches and tags`のところに上で指定した「`main`」などのブランチ名が記載されているかどうかを確認し、ない場合は追加する。  
昔のデフォルトブランチ名は「`master`」だったので、最近「`main`」に変更したなどの場合は注意が必要。
:::


## ③ 記事の作成
まずはブログが寂しいので記事を増やす。

VitePressの記事の管理は、`docs`フォルダ内にマークダウン形式（*.md）のファイルを作成/更新/削除していくことで実施可能。gatsby.js時代にも技術ブログを作っていたので、その時に作ったmdファイル3つを流用。

### mdファイルの作り方
普通の記事ファイルについては、mdファイルのフォーマットはなるべく統一したいので一旦以下フォーマットで作成。

::: tip
上の`---`で挟まれた部分はFrontmatterという。
:::

```md
---
title: 記事タイトル
description: 記事の概要
---

[[toc]]

<<記事内容>>
```

いったん持たせたい要素はこれだけとする。  
`thumbnail:`を持たせようかと思ったけど技術ブログにサムネイルなんて要るかな？ってことで不要とした。  
`category:`を持たせてもいいんだけど、公式が「ファイルベースのルーティング」を謳っているのでそれに沿う形で。  
`tag:`はあると便利なんだけど1:nで扱いが大変そうなので一旦はなしの方向で…。  

::: warning
(!) Found dead link http://localhost:5173 in file vue-js.md と出てビルドがエラーとなってしまう場合。
`config.mts`に以下を追加すると解決。
```ts
  ignoreDeadLinks: "localhostLinks",
```
:::


### フォルダ整理
`docs`フォルダ以下にmdファイルをベタ置きしていくのもあれなので、フォルダを整理する。

`docs/src`フォルダと`docs/src/public`フォルダを作成。`src`の下にカテゴリ別にフォルダ分けしていき、カテゴリごとに`index.md`を置いていく。


## ④ブログの設定

### config.mtsファイルの修正（サイトの設定）
`defineConfig`の中に以下のような設定を追加する。

```ts
  ignoreDeadLinks: "localhostLinks",
  lang: "ja-JP",
  cleanUrls: true,
  srcDir: "./src",
  srcExclude: ["**/README.md", "**/TODO.md"],
  head: [["link", {rel: "icon", href: "/favicon.ico"}]],
  lastUpdated: true,
  sitemap: {
    hostname: 'https://handism.github.io'
  },
```

### config.mtsファイルの修正（レイアウトの設定）
`themeConfig:`の中に以下を追加＆修正。

上から、タイトル横のロゴマーク、ナビゲーションバー、サイドバー、フッタ、最終更新日時、検索バー、ページャー、GitHubリンクの設定。

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
    sidebar: [
      {
        text: 'フロントエンド',
        items: [
          { text: 'Vue.jsのTips', link: '/frontend/vue-js-introduction' },
          { text: 'VitePressのTips', link: '/frontend/vitepress-introduction' },
          { text: 'Vuetifyでカスタマイズ', link: '/frontend/vitepress-vuetify-customize' },
          { text: 'ブログサービスの比較', link: '/frontend/blog-service-compare' }
        ]
      },
      {
        text: 'バックエンド',
        items: [
          { text: 'Spring BootでAPIサーバー', link: '/backend/spring-boot-api-server' },
          { text: 'Swagger Editorを試す', link: '/backend/swagger-introduction' }
        ]
      },
      {
        text: 'その他',
        items: [
          { text: 'Gitの使い方', link: '/tech/how-to-use-git' },
          { text: 'インフラ管理のコツ', link: '/tech/infrastructure-tips' },
          { text: '生成AIのコツ', link: '/tech/generative-ai-tips' }
        ]
      }
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/handism' }
    ]
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

`/docs/.vitepress/theme`に`posts.data.mjs`を作成。

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

ブログトップページの`index.md`はこんな感じのスクリプトを追加する。

```md
---
title: トップページ
description: トップページ
next: false
prev: false
lastUpdated: false
---

<script setup>
import { data as posts } from '../.vitepress/theme/posts.data.mjs'
</script>

<ul>
    <li v-for="post of posts">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
    </li>
</ul>
```

他のカテゴリページの`index.md`はこんな感じにしてみた。URLがカテゴリ名で始まった場合のみリスト化。

```md
---
title: frontendカテゴリ
description: frontendカテゴリ
next: false
prev: false
lastUpdated: false
---

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

::: tip
mdファイル内からVueコンポーネントを呼びたい場合は以下のようにする。  
docs/componentsフォルダにコンポーネントを入れることを想定。  
  
```md
<script setup>
import DrawCanvas from "../../components/DrawCanvas.vue"
</script>

<DrawCanvas />
```
:::


::: tip
mdファイル内で画像を表示したい場合は以下。  
  
```md
![An image](../../public/image.png)
```
:::
