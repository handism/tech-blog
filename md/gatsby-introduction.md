---
title: 過去にGatsbyで作成したブログを手直しする
date: 2023-12-30
tags: [Gatsby, Blog]
category: Frontend
image: gatsby-food.webp
---

## Gatsbyについて

Gatsbyとは、ReactとGraphQLを使用した静的Webサイトジェネレータ（SSG）のこと。読み方は「ギャッツビー」。プログラミング言語としてはJavaScriptやTypeScriptで記載する。

できあがるのが動的でなく静的なWebサイトということもあり、**爆速で画面が表示される**のが大きな特徴とされている。

そして動作上もWebアプリケーションサーバを必要とせず、ホスティングサーバさえあれば良いので運用における**ランニングコストがかからない**点も魅力的。

## 経緯

3年ほど前にGatsbyを利用してブログサイトを自作してGitHubにコミットしていたのだが、現在はそのときの記憶がだいぶ薄れてしまっている。勉強のため、再度Gatsbyに入門して当時の記憶を呼び起こしたい。

https://www.gatsbyjs.com/docs/tutorial/getting-started/part-0/  
↑公式のこのページを参考にする。

## ① Node.jsのインストール

GatsbyはNode.js上で動くので、インストールする。

自分はVue.js導入の際にインストール済みだったので、ここでは割愛。

## ② Gatsbyの導入

npmでGatsby CLIをインストールする。ターミナルで以下を実行。

```zsh
npm install -g gatsby-cli
gatsby --version
```

以下みたいな感じでバージョンが表示されればインストール成功。

```
Gatsby CLI version: 5.13.1
```

## ③ Gatsbyプロジェクトの作成

ターミナルで以下を実行。プロジェクトを作成したいディレクトリに移動して、対話型プロンプトでプロジェクトを作成していく。

```zsh
cd git
gatsby new
```

ここでは、一旦以下のように最小構成としてみた。

```
What would you like to call your site?
√ · Sample Blog
What would you like to name the folder where your site will be created?
√ git/ gatsby-blogsite
√ Will you be using JavaScript or TypeScript?
· JavaScript
√ Will you be using a CMS?
· No (or I'll add it later)
√ Would you like to install a styling system?
· No (or I'll add it later)
```

> 細い回線で上記作業をすると途中でエラーとなってしまうので注意。  
> モバイル回線で実施した場合は、YouTubeを見ながらだと無理だった。

## ④ ローカルで動作確認する

Gatsbyで作成したウェブサイトをローカルで動作確認する場合はターミナルで以下を実行。

```zsh
cd gatsby-blogsite
gatsby develop
```

ビルドに無事成功すれば、以下URLでウェブサイトを確認可能。ホットリロードにも対応している。  
http://localhost:8000/

停止する場合は`Ctrl + C`。

以下でGraphiQLを起動可能。  
http://localhost:8000/\_\_\_graphql

> Tips
> Gatsby CLIを入れずにクイックに始めることも可能。
>
> ```zsh
> npm init gatsby
> cd gatsby-blogsite
> npm run develop
> ```

## ⑤ コーディングを実施

トップページに変更を加えたいなら、テーマ開発者にとってのエントリポイントである`src/pages/index.js`を修正していく。

### プラグインの追加

Gatsbyは機能をプラグインとして追加していくことが可能で、Node.jsのパッケージとして提供されている。

サイトにプラグインを追加するには以下を実施する。

```zsh
npm install [プラグイン名]
```

また、`gatsby-config.js`にもプラグイン名およびプラグイン設定の追加が必要。以下はサイトにマークダウンファイルからデータを読み込む機能を追加するプラグインの例。

```js
  plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown`,
                path: `${__dirname}/contents/markdowns`,
            },
        },
    ],
```

自分の使用しているプラグインは以下。

- gatsby-plugin-typography
- gatsby-transformer-sharp
- gatsby-plugin-sharp
- gatsby-source-filesystem
- gatsby-transformer-remark
- gatsby-remark-autolink-headers
- typography-theme-github
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- @fortawesome/react-fontawesome
- react-share
- gatsby-plugin-image
- gatsby-plugin-manifest

### Reactについて

すでに入門済みの`Vue.js`との違いについて。

コンポーネントが基本的にHTML、CSS、JavaScriptを.vueファイルにまとめて記載するVue.jsに対して、.jsファイルにJavaScriptとして記載してHTMLとCSSはJavaScriptで返すようにするのがReact。

### GraphQLについて

Gatsbyには「**データレイヤー**」と呼ばれる機能があり、これを使用するとどこからでもサイトにデータを取り込むことが可能。

データ層には特別な構文を備えたクエリ言語であるGraphQLが使用されている。

データは1つ以上のソースに保存されるが、そのソースの種類はファイルシステム上のフォルダやWordPressなどのCMS、DBなど多岐に渡る。

データをソースからデータ層に取り込むにはソースプラグインをサイトに追加する。各ソースプラグインは特定のソースからデータを取得し、サイトのGraphQLデータレイヤーに追加される。

GraphQLの例はこんな感じ。

```
    query = { graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
          }
        }
      }
    `}
```
