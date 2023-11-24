---
title: Vue.js + GitHub Actions + GitHub Pagesで技術ブログを自作する
description: Vue.js + GitHub Actions + GitHub Pagesで技術ブログを自作する
---

## {{ $frontmatter.title }}

[[toc]]

### 何故やるのか
ITエンジニアとして働いていて、毎日が勉強だと感じている。
学んだことは技術メモとして残しておきたいと考えているが、あまりお金をかけずに済む方法はないものか…と考えていた。
他には無料ブログ（Blogger、はてなブログ、Qiita、Zennなど）があるが、せっかくなので自分にない技術の勉強も兼ねて自作したい。


### 要件
* 技術メモはMarkdownで記載したい
* 技術ブログの見た目もできれば出来合いのものではなく、CSSを自作したい
* ビルド＆デプロイはGitHub Actionsで自動で行いたい
* GitHub Pagesのサイトの種類は3つあって、プロジェクト、ユーザ、Organization。今回はhttp(s)://[username].github.ioでアクセスしたいのでユーザーサイトを使う


### 前提
* Macを使用


### ①VSCodeの準備
入っていない場合はVSCodeをインストール
https://code.visualstudio.com/download

拡張機能を入れる
日本語化
Vue Language Features (Volar）



### ②Vue.jsのインストール
公式ページを参考にさせていただく。
https://ja.vuejs.org/guide/quick-start.html

まずはNode.jsをインストールする。
https://nodejs.org/en
20.10.0 LTSをインストール

Finderで作業用のフォルダを作成する
例：git

GitHubでリポジトリを作成する
個人ページ＞Repositories＞New
Repository name：[username].github.io
Description：handism’s tech blog
Public
Add a README file：ON

VSCodeでgitフォルダを開き、ターミナルでGitHubからリポジトリをクローンする
cd git
git clone https://github.com/[username]/[username].github.io.git

ターミナルで以下を入力してVue.jsのインストール
npm create vue@latest
Project nane: [username].github.io
他は全部Yes
Testing SolutionはCypress
cd [username].github.io
npm install

開発中にローカルで動作確認したい場合
npm run dev
http://localhost:5173 でアプリにアクセスできる。めちゃくちゃお手軽！
辞めるにはCtrl + C

本番デプロイする場合
npm run build
distフォルダ内に静的ファイルが生成されるので、中身をホスティングサーバにアップロードするだけ。
ローカルのfile://では動かないので注意
npm run previewでhttp://localhost:4173 で動作確認も可能

Gitにコミットする
git config user.name [ユーザー名]
git config user.email [メルアド]


### ③GitHub Pages＆Actionsの設定
https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#カスタム-github-actions-ワークフローによる公開
まずは、distフォルダをWebサイトとしてインターネットに公開（ホスティング）するような設定を行う。

https://ja.vitejs.dev/guide/static-deploy.html
Vite公式に情報がある

GitHub上のリポジトリのページにアクセス
Settings＞Pages
SourceをGitHub Actionsに変更
staticをクリック

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

※Vueの設定は今回は不要
vite.config.jsを修正する
https://[username].github.io/ にデプロイする場合はbaseは/のままでOK。デフォルトは/。


### ④動作確認
ファイルを変更してコミットしてみる
ビルドとデプロイが自動で走って、https://handism.github.io でサイトが見られれば成功！

※デプロイに失敗する場合
Settings>Environmentsの「github-pages」っていう保護ルールを確認。
Deployment branches and tagsのところに上で指定した「main」などのブランチ名が記載されているかどうかを確認。
ない場合は追加する。
昔のデフォルトブランチ名は「master」だったので、最近「main」変更したなどの場合は注意が必要。


### ⑤技術ブログの作成
ここからVue.jsのコーディングを開始する