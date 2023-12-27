---
title: Gatsbyに再度入門する
description: Gatsbyに再度入門する
---

## Gatsbyについて
Gatsbyとは、ReactとGraphQLを使用した静的Webサイトジェネレータ（SSG）のこと。読み方は「ギャッツビー」。  
言語としてはJavaScriptやTypeScriptで記載する。  
  
できあがるのが動的でなく静的なWebサイトということもあり、爆速で画面が表示されるのが大きな特徴とされている。  
そして動作上もWebアプリケーションサーバを必要とせず、ホスティングサーバさえあれば良いので運用におけるランニングコストがかからない点も魅力的。


## 経緯
3年ほど前にこのGatsbyを利用してブログサイトを自作してGitHubにコミットしていたのだが、現在はそのときの記憶がだいぶ薄れてしまっている。  
勉強のため、再度Gatsbyに入門して当時の記憶を呼び起こしたい。  
  
https://www.gatsbyjs.com/docs/tutorial/getting-started/part-0/  
↑公式のこのページを参考にする。


## ①Node.jsのインストール
GatsbyはNode.js上で動くので、インストールする。  
  
自分はVue.js導入の際にインストール済みだったので、ここでは割愛する。


## ②Gatsbyの導入
npmでGatsby CLIをインストールする。  
ターミナルで以下を実行。  
  
```zsh
npm install -g gatsby-cli
gatsby --version
```
  
以下みたいな感じでバージョンが表示されればインストール成功。

```
Gatsby CLI version: 5.13.1
```

## ③Gatsbyプロジェクトの作成
ターミナルで以下を実行。  
プロジェクトを作成したいディレクトリに移動して、対話型プロンプトでプロジェクトを作成していく。  
  
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

::: warning
細い回線で上記作業をすると途中でエラーとなってしまうので注意。  
モバイル回線で実施した場合は、YouTubeを見ながらだと無理だった。
:::


## ④ローカルで動作確認する
Gatsbyで作成したウェブサイトをローカルで動作確認する場合はターミナルで以下を実行。

```zsh
cd gatsby-blogsite
gatsby develop
```

ビルドに無事成功すれば、以下URLでウェブサイトを確認可能。ホットリロードにも対応している。  
http://localhost:8000/
  
停止する場合は`Ctrl + C`。

以下でGraphiQLを起動可能。  
http://localhost:8000/___graphql  


::: tip
Gatsby CLIを入れずにクイックに始めることも可能。

```zsh
npm init gatsby
cd gatsby-blogsite
npm run develop
```
:::


## ⑤コーディングを実施
トップページに変更を加えたいなら、`src/pages/index.js`を修正していく。