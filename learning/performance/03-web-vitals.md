---
title: Core Web Vitals の理解と改善手法
date: 2026-06-21
order: 3
draft: false
---

Webサイトの表示速度やユーザー体験（UX）を定量的に測定するため、Googleが提唱している重要指標のセットが **Web Vitals（ウェブバイタル）** です。本章では、その中でも特に重要な **Core Web Vitals（コアウェブバイタル）** の3つの指標の概念と、それぞれの具体的な改善アプローチについて解説します。

---

## 1. Core Web Vitals の3大指標

Core Web Vitals は、Webページの「読み込み速度」「インタラクティブ性（反応速度）」「視覚的安定性」を測定します。

| 指標 | 意味 | 良好(Good)の目安 | 主な測定内容 |
| :--- | :--- | :---: | :--- |
| **`LCP`** (Largest Contentful Paint) | 読み込みパフォーマンス | **2.5秒以下** | ページ内で最も大きいメイン要素（画像や見出し）が表示されるまでの時間 |
| **`INP`** (Interaction to Next Paint) | インタラクティブ性 | **200ミリ秒以下** | ユーザーのクリックやキー入力などの操作に対して、画面に描画の変更が反映されるまでの遅延時間 (※FIDに代わる新指標) |
| **`CLS`** (Cumulative Layout Shift) | 視覚的安定性 | **0.1以下** | 読み込み中にコンテンツが突然ズレて動く「レイアウトシフト」の累積スコア |

---

## 2. 各指標の発生原因と具体的な改善策

### LCP (最大視覚コンテンツの表示時間)
*   **主な低下原因**: サーバーの応答遅延、レンダリングをブロックする JavaScript/CSS、容量の大きな画像。
*   **改善アプローチ**:
    1.  **画像の最適化**: メインビジュアル画像を次世代フォーマット（WebP/AVIF）へ変換し、適切なサイズで配信する。
    2.  **`fetchpriority="high"` の付与**: LCP対象となる画像タグに優先度高の設定を追加し、ブラウザに早期に読み込ませる。
    3.  **サーバー応答時間の改善**: SSR (Server-Side Rendering) のキャッシュ最適化や、CDN (Content Delivery Network) の活用。

```html:lcp-image.html
<!-- LCP対象の画像は優先読み込みさせる -->
<img src="/hero.webp" fetchpriority="high" alt="メインビジュアル" width="800" height="450">
```

### INP (インタラクションから次の描画までの時間)
*   **主な低下原因**: メインスレッドを長時間占有する（Long Task）重い JavaScript の実行。
*   **改善アプローチ**:
    1.  **JavaScript のコード分割**: `dynamic import` を使い、不要なJSを初期読み込みから除外する。
    2.  **処理の遅延実行**: 重い処理は `requestIdleCallback` や `setTimeout` を使用してメインスレッドを解放し、ユーザー操作への応答を優先する。

### CLS (レイアウトシフトの累積スコア)
*   **主な低下原因**: サイズ（width / height）が指定されていない画像、動的に挿入される広告やウィジェット、Webフォントの読み込み遅延。
*   **改善アプローチ**:
    1.  **画像アスペクト比の確保**: すべての画像要素に `width` と `height` 属性を明示的に指定するか、CSSで `aspect-ratio` を設定し、読み込み前に描画領域を確保する。
    2.  **プレースホルダーの設置**: 動的コンテンツが挿入される領域に、あらかじめスケルトンスクリーン（グレーの仮枠）を置いておく。

```css:layout-shift.css
/* 画像の横幅を可変にしつつ、アスペクト比(16:9)を維持して領域を確保 */
img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
```

---

## 3. Next.js での Web Vitals の計測

Next.js (App Router) では、内蔵の `useReportWebVitals` フックを使用して、本番環境のリアルなユーザー環境における Web Vitals データを簡単にキャッチして解析ツールへ送信できます。

```tsx:app-web-vitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // 例: Google Analytics や 自社ログサーバーへ送信する
    console.log(metric.name, metric.value)
  })
  return null
}
```

これを `app/layout.tsx` などに配置することで、Webサイト全体のUX品質を監視し続けることができます。

---

## まとめ

*   **LCP** は最大のメインコンテンツが表示されるまでの時間（改善策：**画像の優先読込**、**CDN活用**）。
*   **INP** は操作に対する応答の速さ（改善策：**重いJavaScriptの分割・遅延実行**）。
*   **CLS** は画面のブレのなさ（改善策：**画像への `width`/`height`/`aspect-ratio` 指定**）。
