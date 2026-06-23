---
title: コンポーネント駆動CSSとCSS-in-JSの未来
date: 2026-06-23
order: 5
draft: false
quiz:
  question: 従来のランタイムCSS-in-JS（Emotion、styled-components等）が、React Server Components (RSC) の時代において課題とされている最大の理由はどれでしょうか？
  options:
    - CSSのコードサイズが極端に大きくなるため
    - サーバー側でのJavaScript実行時に、動的スタイルの生成やクライアントサイドのコンテキストが利用できず、RSCと相性が悪いため
    - CSSの変数機能（Custom Properties）が一切利用できないため
    - インターネットエクスプローラー11で動作しないため
  correctIndex: 1
  explanation: ランタイムCSS-in-JSは、クライアントサイドでJavaScriptが実行される際に動的にスタイルタグ（style要素）を生成・注入するため、サーバー側での静的・ストリーミング描画をベースとするReact Server Components (RSC) 環境ではそのまま動作せず、パフォーマンス劣化の原因にもなります。このため、RSC時代にはゼロランタイム（ビルド時抽出）やTailwind CSS、CSS Modulesなどが推奨されています。
---

フロントエンド開発において、CSSはWebサイトを装飾するだけのツールから、JavaScriptのコンポーネントシステム（React, Vue等）と深く融合したアセットへと進化しました。

第5章では、近年のコンポーネント駆動開発におけるCSSのアプローチの変遷と、React Server Components時代のスタイリング手法について学びます。

---

## 1. コンポーネント駆動CSSの進化の系譜

WebフロントエンドでCSSをコンポーネントにカプセル化する（スタイルの衝突を防ぐ）ために、さまざまな手法が生まれてきました。

```mermaid
timeline
    title コンポーネントスタイリングの変遷
    1. グローバルCSS : BEM などの命名規則で競合を回避
    2. CSS Modules : ビルド時にハッシュ付きのローカルクラス名へ自動変換
    3. ランタイム CSS-in-JS : styled-components / Emotion。JS内で動的にスタイルを生成
    4. ゼロランタイム & ユーティリティ : Tailwind CSS / Vanilla Extract。JSの実行負荷なくコンポーネント指向を両立
```

---

## 2. React Server Components (RSC) と CSS-in-JS

Next.js App Router に代表される **React Server Components (RSC)** 環境では、コンポーネントがサーバー側でHTMLにレンダリングされてからクライアントに届きます。

ここで従来の `styled-components` や `Emotion` などのランタイム CSS-in-JS を使うと問題が発生します。
*   **サーバーレンダリングの阻害**: サーバー側にはDOM（`document`）が存在しないため、マウント時に動的に `<style>` タグを注入するランタイム処理が機能しません。
*   **クライアントランタイムの肥大化**: スタイルの計算を行うための重いJSエンジンをブラウザで動かす必要があり、表示パフォーマンス（LCP, INPなど）に悪影響を及ぼします。

---

## 3. RSC時代のモダンな解決策

RSC環境でコンポーネントに閉じつつ、パフォーマンスを損なわないためのアプローチは主に3つあります。

```mermaid
graph TD
    RSC[RSC 時代のスタイリング]
    RSC --> Utility[① ユーティリティファースト<br/>例: Tailwind CSS]
    RSC --> Modules[② CSS Modules<br/>例: styles.module.css]
    RSC --> ZeroRuntime[③ ゼロランタイム CSS-in-JS<br/>例: Vanilla Extract / Panda CSS]
    
    style Utility fill:#eff6ff,stroke:#3b82f6
    style Modules fill:#faf5ff,stroke:#a855f7
    style ZeroRuntime fill:#f0fdf4,stroke:#22c55e
```

### ① Tailwind CSS / ユーティリティクラス
コンパイル時に使用されているクラス名だけを含む極小のCSSファイルを自動抽出し、ランタイム不要で動作します。RSCでも完全にサーバーサイドで完結するため相性が抜群です。

### ② CSS Modules
Next.jsに標準搭載されているローカルスコープ化の仕組み。JavaScriptファイルでクラス名をオブジェクトとしてimportし、ビルド時に静的CSSとしてファイル出力します。

### ③ ゼロランタイム (Zero-Runtime) CSS-in-JS
`Vanilla Extract` や `Panda CSS` のように、**「コード上はJSで記述するが、ビルド（コンパイル）時に純粋な静的CSSファイルとして抽出され、JSの実行オーバーヘッドがゼロになる」** ライブラリです。型安全なCSS設計とハイパフォーマンスを両立させます。

---

## まとめ

*   従来のランタイム CSS-in-JS は、RSC (React Server Components) のサーバーファーストなレンダリングと相反し、ランタイムコストが高い。
*   RSC時代のスタイリングは、ランタイムでのJS実行を排除した **Tailwind CSS**、**CSS Modules**、あるいはビルド時にCSSを抽出する **ゼロランタイム CSS-in-JS** が主流となっている。
*   コンポーネントのカプセル化と、ブラウザでのCSS実行パフォーマンスの双方を重視する選択が必要である。
