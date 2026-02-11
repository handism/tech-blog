---
title: VitePressで作ったブログをNext.jsにマイグレーションする
date: 2026-02-01
tags: [Next.js, React, Blog]
category: Frontend
image: vitepress-to-nextjs.webp
---

## 経緯

もうちょい前の話になるけど、仕事でも愛用しているGitHub Copilotが誰でも無料で使えるようになったこともあり、なんかコーディングをしてみたくなった。

さて何を作ろうか？というときに、自分の技術ブログがVueのVitePressのJAMstackで作られているのを思い出して、前から使ってみたかったReactで作り直してみようかなぁと。

## 仕様を考える

まぁブログをやるだけならいくらでも無料サービスはあるんだけど、自分で思いのままにシステムをいじれて、かつ無料で運用できるってことで今回もGitHub PagesにSSGでビルドした静的なサイトをホスティングする形にしてみることに。

Reactで色々調べてみると、結局「Next.js」っていうフレームワークがSSGに向いてて良さそうとのこと。

今までは記事に集中できるように1カラムデザインとしていたが、今回は2カラムデザインとしてみる。

こうして出来上がったブログが以下。

![alt text](/images/image.png)

## Next.jsの導入

### Node.js をインストール

MacかつHomebrew導入済みであれば以下コマンドでOK。

```sh
brew install node
```

### Next.jsプロジェクトを作成

ボイラープレートを構築するには、以下コマンドを打つだけ。

```sh
npx create-next-app@latest
```

対話的に設定が可能。デフォルトだと以下が導入される。

- TypeScript
- Tailwind CSS
- ESLint
- App Router
- Turbopack

### ローカルで動作確認

ターミナルで以下を打つ。

```sh
cd my-app
npm run dev
```

ブラウザで`http://localhost:3000`にアクセスして動作確認可能。

## Node.jsについて

JavaScriptのブラウザ以外での動作環境として、Node.jsというランタイムが存在する。

Reactによるアプリ開発や、ECMAScriptのトランスパイル、バンドルといった操作はNode.jsによって行う。

Reactなどの各種ライブラリは、Node.jsのパッケージマネージャであるnpmによってインストール可能。

## Reactについて

すでに入門済みの`Vue.js`との違いについて。

コンポーネントが基本的にHTML、CSS、JavaScriptを.vueファイルにまとめて記載するVue.jsに対して、.jsファイルにJavaScriptとして記載してHTMLとCSSはJavaScriptで返すようにするのがReact。

宣言的にDOM操作を行うために開発されたのがReact。JSXというJavaScriptの拡張構文を用いて宣言的にDOMを操作可能。また、状態管理も可能。

Reactでは、画面要素を`コンポーネント`という単位に分割して再利用可能な形で扱うことが可能。

Reactで実装したWebアプリケーションは、SPA（シングルページアプリケーション）になる。

## Next.jsについて

SPAの課題として、ページの初期表示が遅くなる点と、検索エンジンのクローラーがHTMLメタ情報を読み取るのが難しいという点が挙げられる。

これらの課題は、Next.jsによる`サーバーサイドレンダリング（SSR）`という手法によって、Webサーバー上であらかじめJavaScript（React）からHTMLを生成することで解決できる。

他にも、APIサーバーとしての役割を持たせることや、`静的サイト生成（SSG）`の機能もある。ファイルベースルーティングも可能。

デプロイ先は`Vercel`がおすすめ。

## TypeScriptについて

静的型付け機能を追加したJavaScriptのスーパーセットのこと。Microsoftが開発。

トランスパイルすることでJavaScriptに変換される。

JavaScriptの動的型付けを起因とする実行時エラーから解放されるのが大きなメリット。

`tsconfig.json`でトランスパイルの詳細を決定する。

## ChatGPTがまとめてくれたReact/Next.js実戦メモ（数日間の学び）

### 全体を通した重要な学び

- remark / rehype は混ぜると死ぬ
- TOC・検索・SEO は **HTML を正**とする
- Tailwind は動的 class に弱い
- 日本語全文検索は Fuse.js の限界を理解する
- Next App Router は Promise 前提

---

### Markdown / HTML / パース周り

- Markdown → HTML → 表示、という **流れを常に意識**
- remark と rehype は役割が違う（混在させない）
- TOC・検索・SEO は Markdown ではなく **最終HTMLを信頼**
- 見出しIDは「自分で生成」より「付いた結果を読む」
- 正規表現ベースのTOCは壊れやすい

---

### TOC（目次）

- TOCは Markdown から作らない、**HTMLから作る**
- `href` と `id` が1文字でもズレたらリンクは機能しない
- `user-content-` プレフィックスは典型的な地雷
- Tailwind の `pl-${}` は効かない（静的class必須）
- 見出しレベルが深いほど **右に寄せる方が自然**

---

### Tailwind / CSS 設計

- Tailwindは **動的classに弱い**
- Markdown表示には `prose` が必須
- ダーク/ライト切り替えは **CSS変数で一元管理**
- 各コンポーネントに色を書くと後で破綻する
- スタイルは「ページ」より「レイアウト」に集約

---

### 検索（Fuse.js）

- Fuse.js は **形態素解析しない**
- 日本語検索は「たまたまヒットする」ケースがあるだけ
- `plaintext` は必須フィールド（optionalにしない）
- 長文検索では `ignoreLocation: true` が重要
- 完璧な日本語検索は Fuse.js では難しい

---

### TypeScript / 型設計

- `string | undefined` は最大の敵
- Search用データと表示用データは型を分ける
- `any` は最後の逃げ道（使ったら必ず戻す）
- 型エラーは **設計ミスのシグナル**

---

### Next.js App Router

- App Router の `params` は **Promise前提**
- Server / Client Component の境界を常に意識
- `fs` は Server Component だけで使う
- Layout に集約すると全体が一気に楽になる
- build が通るまで安心しない（型チェックは最後）

---

### 開発フロー・トラブル系

- favicon.ico は意外と鬼門
- ビルドは「動いてたものを壊す」
- GitHubに上げる前に `.env` / secrets を再確認
- Linterは早めに入れると後が楽
- デグったら「一段階前に戻す」が最速

---

### 設計思想（重要）

- レイアウトは共通化、差分は `children`
- 記事 / カテゴリ / 検索は「中身だけ違う」
- 表示より **データの形を先に整える**
- 後から機能を足す前提で作ると壊れにくい

---

### 総括

- Next.jsは「分かってる人向けの優しさ」
- ブログは小さな機能の集合体
- 一個ずつ潰せば、ちゃんと積み上がる
- 今回のハマり方は **確実に実戦力が上がるやつ**

## 感じたこと

- GitHub CopilotはいちいちチャットUIにソースをコピペしなくても、ワークスペース全体を把握した上でソース修正なり回答なりをしてくれるのが本当に便利で手放せない存在になってしまった
  - でも、たった1日で無料分の月間クォータを食い潰してしまった…。1ヶ月待つのはしんどいからめっちゃ課金したくなってしまった
  - 代わりとしては、`Amazon Q Developer`が無料だから良いかも
  - 有料だけど`Claude Code`も気になってきてしまった
- React/Next.jsがほぼ未経験にも関わらず、2日間でマイグレーションがほぼ完成できたのはやっぱりAIすごいなぁと感じた
  - いわゆる「バイブコーディング」をやってみたけど、成果物を完成させる速度は確かに早かったけど技術的に成長できた感じはしないなぁ
  - 使い捨てツールならいいんだけど、結局ソースコードがツギハギだらけになっててなんだかなぁと。結局大事なのは設計力だなぁ
- Next.jsと相性の良いらしい`Vercel`も気になってきた。特にAPI作りたくなった場合は試してみたい
- `Codex`も試してみる。いい感じ
- `Gemini Code Assist`も入れたけど無料枠多くて良さそう

## リファクタリング

- 各コンポーネントにダークモードの背景色とテキスト色が書かれてたのでhtml要素にまとめる
- Tailwindの書き方がバージョン3と4で混在していたので4に統一
- srcフォルダ作成
- libフォルダをsrc以下に移動
- componentsをsrc以下に移動
- typesフォルダを作成してposts.tsを移動
- src/config/site.tsを新規作成
- Gemini：全体的に、定数はsrc/config/site.tsに外出ししてください
- カテゴリページとタグページも記事一覧ページと同じデザインを適用
- SVGアイコンはLucideに置き換え
- 読了時間表示
- トップへ戻るボタン追加
- 不要なパッケージのアンインストール

```sh
npx depcheck
npm uninstall <package>
```

- コメントつけ直し
  - 「プロジェクト全体を対象に、JSDocを付けて」
- サイトマップ追加
- プライバシーポリシー追加
- ブラウザの開発者モードで出てるエラーの解消
