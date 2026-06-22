---
title: コンテナクエリと最新のCSS機能
date: 2026-06-22
order: 4
draft: false
---

近年、CSSは急速な進化を遂げています。かつては Sass などのプリプロセッサや JavaScript の助けを借りなければ実現できなかったスタイリングやレイアウト制御が、現在のブラウザ標準仕様のみでスマートに実装できるようになっています。

第4章では、コンポーネント指向の開発を強力にサポートする **コンテナクエリ** や、CSS設計に革命をもたらした **`:has()` セレクタ**、**CSS Cascade Layers (`@layer`)**、そして最新の **Tailwind CSS v4** の潮流について学びます。

---

## 1. コンテナクエリ (`@container`)

従来のレスポンシブデザインは、ブラウザのウインドウ幅（ビューポート）を基準にした **`@media` クエリ** が主流でした。しかし、この方法には「同じコンポーネントでも、配置されるサイドバー内かメインエリア内かによって表示幅が変わり、崩れてしまう」という弱点がありました。

**コンテナクエリ** は、ビューポートではなく **「親要素（コンテナ）の幅」** に応じて、コンポーネント自身のスタイルを動的に切り替える技術です。

```text
■ メディアクエリ (@media):
   [ブラウザウインドウ幅] を基準に全体を制御する

■ コンテナクエリ (@container):
   [カードが置かれた親コンテナの幅] を基準にカード単体のスタイルを制御する
   - メインエリア (広い)  --> 横並びのレイアウト
   - サイドバー (狭い)    --> 縦並びのレイアウト
```

### 実装方法
1.  監視対象となる親要素に対して `container-type` を指定します。
2.  子要素に対して `@container` を用いて、親の幅に応じたクエリを記述します。

```css
/* 1. 親要素をコンテナとして定義 */
.card-container {
  container-type: inline-size; /* 横幅を監視対象にする */
  container-name: sidebar-or-main; /* (オプション) 名前付け */
}

/* 2. 子要素（カード本体）のデフォルトスタイル */
.card {
  display: flex;
  flex-direction: column; /* 通常は縦並び */
}

/* 3. コンテナの幅が 400px 以上の時に横並びへ切り替え */
@container (min-width: 400px) {
  .card {
    flex-direction: row; /* 親が広くなったら横並び */
    align-items: center;
  }
}
```

---

## 2. 親セレクタ `:has()` の衝撃

`:has()` セレクタは、長年CSSに不足していた **「特定の条件を満たす子要素を持つ、親要素（またはその前後の要素）を選択する」** という機能を提供する、最も強力な擬似クラスの一つです。

これまでは JavaScript を使って親要素に特定のクラスを付与・削除する処理が必要でしたが、すべてCSSのみで宣言的に完結します。

### 具体的な使用例

#### ①「画像を含むカード」と「テキストのみのカード」で余白や背景を変える
```css
/* .card の中に img タグが存在する場合のみ適用 */
.card:has(img) {
  background-color: var(--color-bg-secondary);
  padding: 0;
}
```

#### ② 入力フォームのエラー状態に応じてフォームグループ全体の枠線を変える
```css
/* .form-group の中に、現在「無効（invalid）」な input がある場合 */
.form-group:has(input:invalid) {
  border-color: var(--color-error);
}
```

---

## 3. CSS Nesting（ネストの標準化）

Sass などのコンパイラを使わずとも、ブラウザ標準のCSSでクラスのネストがネイティブサポートされました。現在、すべての主要ブラウザで利用可能です。

### 構文の比較
Sassのように、親セレクタの中に子セレクタを記述できます。親要素を指す `&`（アンパサンド）記号も使用可能です。

```css
/* ネイティブCSSネスト */
.button {
  background-color: var(--color-primary);
  color: white;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  .icon {
    margin-right: 8px;
  }
}
```
コードの階層構造が分かりやすくなり、記述の重複を大幅に削減できます。

---

## 4. CSS Cascade Layers (`@layer`)

大規模開発においてCSSの詳細度（CSS Specificity）の競合は非常に厄介な問題です。「後から追加したサードパーティ製ライブラリのスタイルを上書きするために `!important` を連発する」といった泥沼化を防ぐために導入されたのが **CSS Cascade Layers (`@layer`)** です。

`@layer` を使うと、CSSファイルを読み込む順序やコードの記述順とは無関係に、**「スタイル定義のレイヤーごとの優先度」をあらかじめ宣言** できます。

```css
/* レイヤーの優先順位を定義 (右側ほど優先度が高い) */
@layer reset, base, components, utilities;

/* baseレイヤーの定義 */
@layer base {
  a { color: blue; }
}

/* componentsレイヤーの定義 */
@layer components {
  /* .btn の詳細度は本来 a より高いですが、components レイヤーが base より優先されるため、
     .btn 内の a の色は red に上書きされます */
  .btn a { color: red; }
}
```

---

## 5. Tailwind CSS v4 の登場と CSS ファースト

Tailwind CSS v4 は、さらに「CSS標準機能」に回帰する大きな変化を遂げました。

*   **CSSファーストの設定ファイル**: 従来の `tailwind.config.js` による JavaScript での設定から、**`@theme` ディレクティブを使用したプレーンな CSS ファイルでの設定**へと移行しました。
*   **ネイティブ `@layer` との調和**: ビルドツールとしてのエンジンの刷新により、CSSのレイヤー構造と Tailwind のコンパイル結果が極めて自然に統合され、CSSの標準規格との親和性が向上しています。

```css
/* Tailwind CSS v4 でのカスタムテーマ設定のイメージ */
@import "tailwindcss";

@theme {
  --color-brand-primary: #3b82f6;
  --font-display: "Lexend", sans-serif;
}
```

---

## まとめ

*   **コンテナクエリ (`@container`)** は、ビューポートではなく「親要素のサイズ」に基づいてコンポーネント個別のレスポンシブ表示を可能にする。
*   **親セレクタ `:has()`** は、JavaScript を使わずに「特定の子要素を持つ親」にスタイルを当てられる画期的な擬似クラス。
*   **CSS Nesting** の標準化により、Sass なしの純粋なCSSで構造化された読みやすい記述が可能になった。
*   **CSS Cascade Layers (`@layer`)** はスタイルの詳細度（優先度）をレイヤーで分離し、意図しない上書き競合を根本的に解決する。
*   **Tailwind CSS v4** をはじめとするツールも、こうしたモダンCSS標準機能を取り入れて進化している。
