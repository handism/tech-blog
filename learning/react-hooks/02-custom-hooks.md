---
title: カスタムフックによるロジックの共通化
date: 2026-06-20
order: 2
draft: false
---

Reactアプリケーションが成長するにつれ、複数のコンポーネントで「同じ状態管理と副作用の組み合わせ」を使いたいケースが出てきます。

第2章では、React標準のフックを組み合わせて独自のフックを作る **カスタムフック（Custom Hooks）** の設計方法とメリットについて学びます。

---

## 1. カスタムフックとは？

カスタムフックは、**「状態（State）や副作用（Effect）を伴う再利用可能なロジック」を切り出したJavaScriptの関数** です。

名前は必ず `use` から始めるというルール（例: `useWindowSize`）があり、関数内部でReact標準のフック（`useState` や `useEffect` など）を自由に呼び出すことができます。

```mermaid
graph LR
  subgraph Component [コンポーネント]
    UI[JSX UIの描画のみに専念]
  end

  subgraph CustomHook [カスタムフック: useWindowSize]
    State[useState: width / height]
    Effect[useEffect: resizeイベント監視]
    State <--> Effect
  end

  CustomHook -->|状態データを返す: { width, height }| Component
  Component -->|トリガー/引数| CustomHook

  style Component fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style CustomHook fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#581c87
```

* **メリット**:
  1. **UIとロジックの分離**: コンポーネントが「見た目（JSX）」に集中でき、コードの見通しが良くなります。
  2. **再利用性の向上**: 同じロジックを複数のコンポーネントで共有できます。
  3. **単体テストの容易さ**: Reactフックのロジックだけを独立してテストできます。

---

## 2. 実用的なカスタムフックの作成例

### 例1: 画面サイズを追跡する `useWindowSize`
レスポンシブデザインで、JavaScript側で画面幅（モバイルかデスクトップかなど）を判定したい場合に非常に役立ちます。

```typescript:src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  // 初期値はサーバーサイドレンダリング（SSR）を考慮し、0 もしくは undefined にします
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // クライアントサイドでのみ実行される
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // イベントリスナーを登録
    window.addEventListener('resize', handleResize);

    // クリーンアップ関数でイベントリスナーを解除
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 初回マウント時のみリスナーを登録

  return windowSize;
}
```

### コンポーネントでの使用例

```tsx:src/components/MyComponent.tsx
import { useWindowSize } from '@/hooks/useWindowSize';

export default function MyComponent() {
  const { width } = useWindowSize();

  return (
    <div>
      <p>現在の画面幅: {width}px</p>
      {width < 768 ? (
        <p>モバイル向けレイアウトで表示中 📱</p>
      ) : (
        <p>PC向けレイアウトで表示中 💻</p>
      )}
    </div>
  );
}
```

---

## 3. カスタムフック設計のルール

カスタムフックを作る際は、以下のルールを守る必要があります。

1. **命名規則**: 必ず `use` から始める（これにより、Reactのリンターや実行エンジンが「これはフックである」と正しく認識し、フックのルールを検証できます）。
2. **フックの呼び出し制限**: ループや条件分岐（`if` 文）、あるいはネストされた関数の中でフックを呼び出してはいけません。常にコンポーネントやカスタムフックの「最上位（トップレベル）」でのみ呼び出します。
3. **状態は共有されない**: 同じカスタムフックを2つのコンポーネントで呼び出しても、**それらの「状態（State）」は完全に独立** しています（ロジックの書き方は共有されますが、状態自体は共有されません）。状態そのものを共有したい場合は、React Context や状態管理ライブラリを使用します。

カスタムフックを使うことで、複雑なReactコンポーネントをシンプルに保ち、保守性の高いきれいなコードを書くことができます。積極的に活用していきましょう！
