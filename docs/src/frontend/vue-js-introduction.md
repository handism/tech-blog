---
title: Vue.jsをあれこれ試してみる
description: Vue.jsをあれこれ試してみる
---

[[toc]]

## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* Macを使用


## ①VSCodeの準備
入っていない場合はVSCodeをインストール  
https://code.visualstudio.com/download

### 拡張機能を入れる
* 日本語化
* Vue Language Features (Volar)


## ②Vue.jsのインストール
公式ページを参考にさせていただく。  
https://ja.vuejs.org/guide/quick-start.html

### Node.jsのインストール
https://nodejs.org/en  
`20.10.0 LTS`をインストール

### 作業用のフォルダの作成
例：`git`

### GitHubでリポジトリの作成
* 個人ページ＞Repositories＞New
  * Repository name：[username].github.io
  * Description：handism’s tech blog
  * Public
  * Add a README file：ON

作成後は、VSCodeで`git`フォルダを開き、ターミナルでGitHubからリポジトリをクローンしておく。  


### Vue.jsのインストール
ターミナルで以下を入力してVue.jsのインストールする。
```zsh
npm create vue@latest
```

* Project nane: `[username].github.io`
* 他は全部`Yes`
* `Testing Solution`は`Cypress`

```zsh
cd [username].github.io
npm install
```

### ローカルで動作確認
開発中にローカルで動作確認したい場合は以下コマンドで。  
  
```zsh
npm run dev
```

`http://localhost:5173`でアプリにアクセスできる。めちゃくちゃお手軽！  
サーバーを止めるには`Ctrl + C`

### 本番デプロイ
本番デプロイする場合は以下コマンド。  

```zsh
npm run build
```

`dist`フォルダ内に静的ファイルが生成されるので、中身をホスティングサーバにアップロードするだけ。

::: warning
ローカルの`file://`では動かないので注意。
:::

```zsh
npm run preview
```

`http://localhost:4173`で動作確認も可能。  
  
作業が終わったらGitにコミットする。  


## ③GitHub Pages＆Actionsの設定
参考：https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#カスタム-github-actions-ワークフローによる公開  
まずは、`dist`フォルダをWebサイトとしてインターネットに公開（ホスティング）するような設定を行う。  

参考：https://ja.vitejs.dev/guide/static-deploy.html  
↑Vite公式に情報がある。

### GitHub上のリポジトリのページにアクセス
* Settings＞Pages
* SourceをGitHub Actionsに変更
* staticをクリック

ファイルの内容を以下に変更してコミット。

```yaml
# 静的コンテンツを GitHub Pages にデプロイするためのシンプルなワークフロー
name: Deploy static content to Pages

on:
  # デフォルトブランチを対象としたプッシュ時にで実行されます
  push:
    branches: ['main']

  # Actions タブから手動でワークフローを実行できるようにします
  workflow_dispatch:

# GITHUB_TOKEN のパーミッションを設定し、GitHub Pages へのデプロイを許可します
permissions:
  contents: read
  pages: write
  id-token: write

# 1 つの同時デプロイメントを可能にする
concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  # デプロイするだけなので、単一のデプロイジョブ
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          # dist リポジトリのアップロード
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```
::: tip
Vueの設定は今回は不要  
必要ならば`vite.config.js`を修正する  
`https://[username].github.io/`にデプロイする場合はbaseは/のままでOK。デフォルトは/。
:::


## ④動作確認
ファイルを変更してコミットしてみる。  
ビルドとデプロイが自動で走って、`https://[username].github.io`でサイトが見られれば成功！

::: tip
デプロイに失敗する場合  
Settings>Environmentsの「`github-pages`」っていう保護ルールを確認。  
`Deployment branches and tags`のところに上で指定した「`main`」などのブランチ名が記載されているかどうかを確認し、ない場合は追加する。  
昔のデフォルトブランチ名は「`master`」だったので、最近「`main`」に変更したなどの場合は注意が必要。
:::


## ⑤コーディングする
ここからVue.jsのコーディングを開始する

::: tip
Vue.jsのスタイルガイドは以下。  
https://ja.vuejs.org/style-guide/
:::


### 組み込みコンポーネント

```vue
<component>
<keep-alive>
<transition>
<transition-group>
<slot>
<teleport>
<suspense>
```


### 用途別ライブラリ

* ルーティング、SPA：Vue Router
* データ集中管理：Vuex
* UI：Vuetify
* API送受信：axios