---
title: Server Components と Client Components
date: 2026-06-20
order: 1
draft: false
---

Next.js App Router の最大の特徴は、Reactの最新機能である **React Server Components (RSC)** に完全対応している点です。

第1章では、サーバーとクライアントでコンポーネントがどのように役割分担をしているのか、そしてどのように画面が描画されるのかを図解で学びます。

---

## 1. 2つのコンポーネントの基本概念

Next.js App Router では、コンポーネントはデフォルトで **Server Components（サーバーコンポーネント）** になります。必要に応じて **Client Components（クライアントコンポーネント）** と明示的に指定して使い分けます。

| 特徴 | Server Components (RSC) | Client Components (RCC) |
| :--- | :--- | :--- |
| **デフォルト** | **はい** (App Router) | いいえ (`"use client"` が必要) |
| **実行場所** | **サーバー側のみ** | サーバー側（初期ビルド時）＆ **クライアント側** |
| **JSバンドルサイズ** | **0** (ブラウザにJSが送信されない) | ブラウザに送信される（容量が増える） |
| **対話性・状態管理** | 不可 (`useState`, `useEffect` 等は使えない) | **可能** (状態やイベントリスナーを使用) |
| **データ取得** | データベースやAPIへ直接セキュアにアクセス可能 | 通常はAPI経由でアクセス |

---

## 2. サーバーサイドレンダリングの流れ（図解）

コンポーネントがブラウザに届き、画面が表示されるまでの仕組みです。

```mermaid
graph TD
  subgraph Server [1. サーバー側の処理]
    RSC[Server Components の実行] -->|データベース直接取得など| RSC_Exec[コンポーネントツリーの構築]
    RSC_Exec -->|静的なHTMLを生成| HTML[初期HTML]
    RSC_Exec -->|仮想DOM情報などをシリアライズ| Payload[RSC Payload]
  end

  subgraph Client [2. ブラウザ側の処理]
    HTML -->|即座に描画| FastPaint[高速に初期画面を表示<br>(まだ動かない状態)]
    Payload -->|JavaScriptのダウンロード & 実行| Hydration[ハイドレーション<br>(対話機能を有効化)]
    FastPaint -.->|イベント紐付け| Hydration
    Hydration --> Ready[完全に動作するページ]
  end

  style Server fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style Client fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
```

1.  **サーバー側**: 全ての Server Components を実行し、ブラウザが即座に表示できる「初期HTML」と、Reactの状態を復元するためのデータ「RSC Payload」を生成します。
2.  **ブラウザ側**:
    *   まず、JavaScriptの読み込みを待たずにHTMLをパースし、**高速に初期画面を表示**します。
    *   その後、ダウンロードしたJavaScriptを実行し、静的なHTMLに対してイベントハンドラーなどを結合（**ハイドレーション**）して、ページを操作可能な状態にします。

---

## 3. `"use client"` の正しい理解（境界の引き方）

Client Components を使う場合は、ファイルの最上部に `"use client"` ディレクティブを記述します。

注意すべきなのは、**`"use client"` を記述したファイルとそのファイルからインポートされるすべての子コンポーネントが自動的に Client Components になる** という点です。

### 推奨されるコンポーネント設計（境界の最小化）

不要なJavaScriptをブラウザに送らないよう、Client Components は「必要な部分だけ」に最小化するのがベストプラクティスです。

```tsx:src/components/Header.tsx
// Server Component (デフォルト)
import Logo from './Logo';
import SearchBar from './SearchBar'; // "use client" なコンポーネント

export default function Header() {
  return (
    <header>
      <Logo /> {/* 静的な部分はサーバーで処理 */}
      <SearchBar /> {/* 入力状態やイベントを持つ対話的な部分だけクライアントで処理 */}
    </header>
  );
}
```

---

## まとめ

*   Next.js App Router は、**Server Components** がデフォルト。余計なJSを削減し表示を高速化する。
*   対話性（状態管理、イベントハンドラー）やブラウザ専用APIが必要な部分だけ、最上部に `"use client"` を付けて **Client Components** にする。
*   サーバーでプレビュー（HTML）を作成して高速に表示し、後からJavaScriptを結合（**ハイドレーション**）することで、表示速度と機能性を両立している。

次は、Next.jsでのデータの取得方法と、それをキャッシュして表示を極限まで高速化する仕組みについて学びましょう！
