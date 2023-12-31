---
title: VitePressのカスタムテーマを自作する
tags: [frontend, vue, vitepress, blog]
image: symbol-mark.webp
---

## 何故やるのか
VitePressで技術ブログを作ってみたのだが、デフォルトのテーマがすごくおしゃれでダークテーマとライトテーマを切り替えられたりして便利だけども、やっぱり勉強のためにカスタムテーマを自作してみたくなった。

といっても日本語の情報はネットにほとんど落ちていないので、公式のドキュメントを読んだり試行錯誤したりして頑張ってみる。


## 要件
* 技術ブログの見た目はできれば出来合いのものではなく、CSSを自作したい
* シンプルかつ軽快に動作するVitePressテーマにする
* TypeScriptは使用せず、JavaScriptで作成
* 極力外部モジュールを使用しない
* ブログ運営に手間をかけさせない
* URLは`/[mdファイル名]`の形式、タグページは`/tag/[タグ名]`の形式
* 1カラムのレスポンシブレイアウト


## 前提
* npmのバージョン：10.2.3
* node.jsのバージョン：v20.10.0
* Vue.jsのバージョン：3.3.4
* VitePressのバージョン：v1.0.0-rc.30
* 既にVitePressプロジェクトができていることが前提
* 開発にはWindows 11を使用


## ① index.jsの修正
テーマ開発者にとってのVitePressのエントリポイントは`.vitepress/theme/index.js`。以下のように修正して、自作のVue.jsのSFCが読み込まれるようにする。

```js
// https://vitepress.dev/guide/custom-theme
import SimplaLayout from './SimplaLayout.vue'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  Layout: SimplaLayout,
  enhanceApp({ app, router, siteData }) {
    // ...
  }
}
```

## ② Vue.jsでテーマの作成
Vue.jsのSFCを作成していく。コンポーネントは`.vitepress/theme/components`フォルダに入れていくことにした。

今回は1カラムレイアウトなので、以下のような`Header`、`Main`、`Footer`のシンプルな構成としている。

```vue
<script setup>
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Header />
  <Main />
  <Footer />
</template>
  
<style scoped>
</style>
```

`Main.vue`の中身は以下とした。ポイントは`<Content />`タグで、これを記載した部分に.mdファイルの中身をHTMLにレンダリングしたものが流し込まれるという仕組み。

```vue
<script setup>
import ArticleHeader from "./ArticleHeader.vue"
</script>

<template>
  <div class="main-content">
    <article>
      <!-- Add more article content as needed -->
      <ArticleHeader />
      <Content />
    </article>
  </div>
</template>
  
<style scoped>
.main-content {
  padding: 0.8rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
  overflow-wrap: break-word;
}
</style>
```

グローバルなCSSについては`.vitepress/theme/style.css`に記載していく。一般的なCSSと同様なので今回は過去に作成したものを流用したためここでは割愛。

これだけでほぼブログサイトが完成する。とはいえ、これだけでは機能が少なすぎて何かと不便なことが多いので作りこみを行っていく。

## ③ レスポンシブ対応
今時のWebサイトであればもはやレスポンシブ対応は必須要件。

自作のテーマを試しにスマホで表示してみたらレイアウト崩れがいくつかあったので修正していく。


### viewport設定（不要）
本来、レスポンシブ対応にはHTMLの`<head>`要素内に以下のような`viewport`設定を入れる必要がある。

```html
<meta name="viewport" content="width=device-width,initial-scale=1">
```

出力されたHTMLを確認してみたところ、VitePressの場合はデフォルトで出してくれているので**対応は不要**。


### メインコンテンツの横幅修正
1カラムのデザインなのでメインコンテンツ部分はパソコンでは`800px`の幅でセンタリングしたい。一方、スマホで見たときは画面の横幅に合わせるようにする。

この要件は以下のように`width`と`max-width`を組み合わせることで実現できた。

また、`box-sizing: border-box;`の設定はborderやpaddingをwidthの範囲内で計算してくれるようになるのでほぼ必須な設定。これがないと色々面倒くさい…

```css
.main-content {
  padding: 0.8rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
```

::: tip
CSSを設定する際には`%`や`rem`を使うことを意識すると良い。これらは相対的な単位なので自然とレスポンシブ対応になる。
:::


### 画像が枠をはみ出すのを修正
スマホで画像が枠をはみ出してしまって横スクロールが発生して不格好になってしまったので修正。`max-width`のcssをあてれば親要素をはみ出ることはなくなる。

```css
.thumbnail {
  max-width: 95%;
}
```

### URLや英文が枠をはみ出すのを修正
同じく長いURLなどがはみ出してしまうのでこちらも修正。`overflow-wrap`を`break-word`に変更すれば折り返される。

```css
.main-content {
  overflow-wrap: break-word;
}
```

## ④ タグ機能を追加


## ⑤ サムネイル画像表示機能を追加


## ⑥ CSS変数を導入
`:root`疑似クラスに対してカスタムプロパティを定義することでHTML全体に適用される。


```css
:root {
  --main-bg-color: brown;
}

element {
  background-color: var(--main-bg-color);
}
```

## ⑦ 動作確認
ローカルでの動作確認方法は別記事に記載済みのため割愛。

スマホで確認する場合は、いろいろ準備するのが面倒なのでGitHubにデプロイしてからiPhone、Androidの実機で確認している。

OSの設定を参照した自動ダークモードを実装しているので、