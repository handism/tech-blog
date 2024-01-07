---
title: VitePressのカスタムテーマを自作する
tags: [Frontend, Vue, VitePress, Blog]
image: man-with-pc.webp
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
import SimplaLayout from './SimplaLayout.vue'
import './style.css'

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

`Main.vue`の中身は以下とした。ポイントは`<Content />`タグで、これを記載した部分に.mdファイルの中身をHTMLにパースしたものが流し込まれるという仕組み。

```vue
<script setup>
import ArticleHeader from "./ArticleHeader.vue"
</script>

<template>
  <div class="main-content">
    <article>
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

これだけでブログサイトがほぼ完成する。とはいえ、これだけでは機能が少なすぎて何かと不便なことが多いので作りこみを行っていく。

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

また、`box-sizing: border-box;`の設定はborderやpaddingをwidthの範囲内で計算してくれるようになるのでほぼ必須な設定。これがないと色々面倒くさい…。

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

### コードブロックが枠をはみ出すのを修正
スマホで見ると、コードブロックなどの`pre`タグがはみ出てしまって見た目がよろしくない。以下のように`overflow`を`auto`や`scroll`に変更しておけば、はみ出た部分がいい感じに横スクロールで見られるようになるので便利。

```css
pre {
  overflow: auto;
}
```

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

## ④ タグ機能 ＆ サムネイル画像表示機能を追加
一般的なブログの記事の上らへんに良くあるのが、タグとサムネイル画像を表示する機能。勉強がてら機能を追加してみる。

タグについては、カテゴリのようにフォルダ作成で管理ができないのでFrontmatterで管理することに。`tag:`を新たに追加。1記事あたりN個のタグを付けられるように配列形式とする。

画像は`src/public`に入れていくとして、記事ごとにどの画像を表示するか？についても同様にFrontmatterで管理することにした。`image:`も新たに追加。

```md
---
title: VitePress + GitHub Actions + GitHub Pagesで技術ブログを自作する
tags: [frontend, vue, vitepress, blog]
image: man-with-pc.webp
---
```

タグと画像を表示するために、記事上用に`ArticleHeader.vue`コンポーネントを作成して以下のようにした。

```vue
<script setup>
import { useData } from 'vitepress'

const { frontmatter, page } = useData()
</script>

<template>
  <div class="entry-meta">
    <time v-if="frontmatter.title">{{ new Date(page.lastUpdated).toLocaleDateString({timeZone: 'Asia/Tokyo'}) }}</time>
    <h1 v-if="frontmatter.title" class="entry-title">{{ frontmatter.title }}</h1>   
    <span v-for="tag in frontmatter.tags" class="tags">
      <a :href="`/tag/${tag}`" class="tag">{{ "# " + tag }}</a>
    </span>
    <img v-if="frontmatter.image" :src="frontmatter.image" class="thumbnail" alt="ブログのサムネイル画像">
  </div>
</template>
```

ブログ内で使用されているタグ一覧の表示は少々面倒だった。VitePressが提供している**データローダー**の機能を利用する。

参考：https://vitepress.dev/guide/data-loading

公式サイトを参考にし、こんな感じでデータローダーを作成。

```js
import { createContentLoader } from 'vitepress'

export default createContentLoader('src/*.md', {
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

タグ一覧を表示したいmdファイルでデータローダーを読み込み、以下のようにしてタグ一覧を表示した。

```md
<script setup>
import { data as posts } from '../.vitepress/theme/components/posts.data.mjs'

const tagSet = new Set() // タグを格納するためのセット

posts.forEach((data) => {
  // tags:がある場合は配列からセットに格納していく
  if (data.frontmatter && data.frontmatter.tags && Array.isArray(data.frontmatter.tags)) {
    data.frontmatter.tags.forEach((tag) => tagSet.add(tag))
  }
})
</script>

## タグ一覧

<ul>
  <li v-for="tag of Array.from(tagSet)">
    <a :href="'/tag/' + tag">{{ tag }}</a>
  </li>
</ul>
```

タグのアーカイブページも自作。どうしてもURLは`/tag/[タグ名]`の形にしたかったので、VitePressの**ルーティング**機能をうまく使うことで実現した。

参考：https://vitepress.dev/guide/routing

`/src/tag/[tag].md`ファイルと`/src/tag/[tag].paths.mjs`ファイルを新たに作成。

mdファイルのほうでは、上と同じようにデータローダーを利用して特定のタグを持つ記事の一覧を出力するように。

mjsファイルのほうでは、データローダーがどうしても使用できなかったため、以下のように`fast-glob`と`gray-matter`を利用してmdファイルの一覧を読み込んでタグ一覧を返すようにしてみた。

```js
/**
 * @file [tag].paths.mjs
 * @description フォルダ内のMarkdownファイルをすべて読み込み、Frontmatterのtags:からタグ一覧を返却する
 */

import fg from 'fast-glob'
import matter from 'gray-matter'

const folderPath = 'src/*.md' // Markdownファイルのあるフォルダのパスを指定
const tagSet = new Set() // タグを格納するためのセット
const files = fg.sync([folderPath, '!**/node_modules'])

files.forEach((file) => {
  // Markdownファイル内のFrontmatterを取得
  const { data } = matter.read(file)

  // tags:がある場合は配列からセットに格納していく
  if (data && data.tags && Array.isArray(data.tags)) {
    data.tags.forEach((tag) => tagSet.add(tag))
  }
})

// 重複をなくしたタグの一覧を配列に変換
const tagList = Array.from(tagSet)
// VitePressのパラメータ用にオブジェクト形式に変換
const paramsArray = tagList.map((tag) => ({ params: { tag } }))

/**
 * タグ一覧を返却
 * @param なし
 * @returns {any[]} タグ一覧
 */
export default {
  tagList() {return tagList},
  paths() {return paramsArray}
}  

```


## ⑤ CSS変数を導入（自動ダークモードの対応）
昔はCSSを一生懸命べた書きしていたが、ふとCSS変数を使用してみようと思って挑戦してみた。

と言っても仕組みは簡単で、他のプログラミング言語みたいに変数を宣言し、値を複数個所で参照できるってだけ。`:root`疑似クラスに対してカスタムプロパティを定義することでHTML全体に適用され、参照は`var([変数名])`。

グローバルでCSSを読み込んでおけば、各Vueコンポーネントから参照することも可能なので便利。

```css
:root {
  --main-color: #202124;
  --base-color: #e8eaed;
  color: var(--main-color);
  background-color: var(--base-color);
}

@media (prefers-color-scheme: dark) {
  :root {
    --main-color: #e8eaed;
    --base-color: #202124;
  }
}
```

こんな感じで、クライアント端末のOSのダークモード設定によって自動的にダークモードを適用するようなスタイリングが実現できた。


## ⑥ 動作確認
ローカルでの動作確認方法は別記事に記載済みのため割愛。

スマホで確認する場合は、いろいろ準備するのが面倒なのでGitHubにデプロイしてからiPhone、Androidの実機で確認している。

OSの設定を参照した自動ダークモードを実装しているので、設定をONにしたりOFFにしたりしてモードが変わることも確認。


## ⑦ その他もろもろ
* 著作権表示の&copy;は普通にネットからコピーしてきただけではブラウザでうまく表示できなかった。`&copy;`と記載すればちゃんと表示される
* 記事下の前記事/次記事へのリンクボタンは`display: table;`と`vertical-align: middle;`でなんとかいい感じのスタイリングができた
  * 前後記事のリンクやタイトルはデータローダーから取得
  * Vue.jsの`v-for`は`<template>`タグにかけると無駄なタグが増えないので便利
  * タグの属性内でJavaScriptの変数を参照したい場合は`:`でバインディングすると便利
* 右下に固定で表示される上方向へのスクロールボタンについては、`ChatGPT`にお願いしたらほぼそのまま使える形で作ってくれた
* 記事のサムネイル画像は`Midjourney`が高クオリティでいい感じ
* イラレやフォトショにある「色の乗算」はCSSの`mix-blend-mode`で実現可能
* `linear-gradient`で線形グラデーションもできる