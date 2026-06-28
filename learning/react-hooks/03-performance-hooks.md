---
title: useMemo と useCallback による最適化
date: 2026-06-21
order: 3
draft: false
quiz:
  question: "子コンポーネントにPropsとして関数を渡す際、再レンダリングごとに新しい関数の参照が作られてしまうのを防ぐ（関数の同一性を維持する）ためのフックはどれでしょうか？"
  options:
    - "useMemo"
    - "useCallback"
    - "useRef"
    - "useContext"
  correctIndex: 1
  explanation: "`useCallback` は、依存配列の値が変わらない限り、渡された関数のインスタンス（参照）をメモ化して再利用します。これに対し、関数の「計算結果の値」をメモ化する場合は `useMemo` を使用します。"
---

Reactアプリケーションの規模が大きくなると、コンポーネントの不要な再レンダリングによるパフォーマンス低下が問題になることがあります。本章では、再レンダリングを最適化するための強力なフックである **`useMemo`** と **`useCallback`**、および **`React.memo`** の正しい使い方とアンチパターンを学びます。

---

## 1. React の再レンダリングのトリガー

Reactコンポーネントが再レンダリングされる主なタイミングは以下の3つです。

1.  **State (状態) の更新**: 自身の `useState` や `useReducer` の値が変わったとき。
2.  **Props (プロパティ) の変更**: 親コンポーネントから渡される値が変わったとき。
3.  **親コンポーネントの再レンダリング**: 親が再レンダリングされると、子は **Props に変化がなくても** デフォルトですべて再レンダリングされます。

---

## 2. useMemo と useCallback の違いと仕組み

両者とも、**「前回の計算結果（または関数定義）をメモリに保存（メモ化）しておき、依存配列の値が変わらない限り再利用する」** ためのフックです。

*   **`useMemo`**: 計算結果の **「値」** をメモ化します。
*   **`useCallback`**: **「関数自体」** をメモ化します。

### 関数の同一性と useCallback の必要性
JavaScriptにおいて、インラインで定義された関数は、レンダリングのたびに **「新しい参照（新しいインスタンス）」** として再生成されます。

```typescript:identity.ts
const handleClick1 = () => console.log('clicked');
const handleClick2 = () => console.log('clicked');

console.log(handleClick1 === handleClick2); // false (参照が異なるため)
```

そのため、子コンポーネントに関数を渡す場合、毎回新しい関数が渡されることになり、子が不要に再レンダリングされてしまいます。これを防ぐために `useCallback` を使って関数の参照を固定します。

---

## 3. 最適化の流れ（図解）

親コンポーネントが再レンダリングされたとき、`React.memo` と `useCallback` がどのように無駄な子の再レンダリングを防ぐかを整理します。

```mermaid
graph TD
    Parent[親コンポーネントが再レンダリング] --> ChildMemo{子コンポーネントは<br>React.memo化されているか?}
    
    ChildMemo -->|No| RenderChild[子も強制的に再レンダリングされる]
    ChildMemo -->|Yes| PropsChanged{渡されているPropsに<br>変化はあるか?}
    
    PropsChanged -->|Yes| RenderChild
    PropsChanged -->|No (参照も不変)| SkipChild[子の再レンダリングをスキップ]

    style Parent fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style ChildMemo fill:#faf5ff,stroke:#a855f7,stroke-width:2px
    style RenderChild fill:#fecaca,stroke:#ef4444,stroke-width:2px
    style SkipChild fill:#bbf7d0,stroke:#22c55e,stroke-width:2px
```

※ **注意**: 子コンポーネントに `React.memo` を適用していない場合、親が渡す関数を `useCallback` でラップしても、子は強制的に再レンダリングされてしまいます。**`useCallback` は `React.memo` と組み合わせて初めて効果を発揮します。**

---

## 4. 具体的なコード例

### 悪い例（不要な最適化）

`useMemo` や `useCallback` の実行、および依存関係の比較自体にもわずかなオーバーヘッドがかかります。そのため、以下のような単純な処理をメモ化するのは逆効果（アンチパターン）です。

```typescript:anti-pattern.tsx
// × 避けるべき例
const doubleCount = useMemo(() => count * 2, [count]); // 単純な計算にuseMemoは不要

const handleReset = useCallback(() => {
  setCount(0);
}, []); // 子コンポーネントに渡さない、かつ依存がないならuseCallbackは不要
```

### 良い例（適切な最適化）

1.  重い計算処理を実行する場合
2.  `React.memo` 化された子コンポーネントに、オブジェクトや関数を Props として渡す場合

```tsx:optimized-component.tsx
import React, { useState, useMemo, useCallback } from 'react';

// 子コンポーネントを React.memo でラップし、Propsに変更がない限り再レンダリングを防ぐ
const ExpensiveChild = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered!');
  return <button onClick={onClick}>クリック</button>;
});
ExpensiveChild.displayName = 'ExpensiveChild';

export function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // 1. 重い計算処理を useMemo でラップ
  const expensiveValue = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 10000000; i++) sum += i; // 擬似的な高負荷処理
    return sum + count;
  }, [count]); // count が変わったときだけ再計算する (text の変更では再計算されない)

  // 2. 子に渡すコールバック関数を useCallback でラップ
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // 依存配列が空なので、関数の参照は常に同一に保たれる

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <p>計算結果: {expensiveValue}</p>
      <ExpensiveChild onClick={handleClick} />
    </div>
  );
}
```

---

## まとめ

*   **`useMemo`** は重い計算結果（値）を保存し、**`useCallback`** は関数の参照を保存する。
*   `useCallback` は、**`React.memo` でメモ化された子コンポーネントに関数を渡すとき** に使用する。
*   安易なメモ化はコードを複雑にし、オーバーヘッドを増やすため、**パフォーマンス計測の根拠に基づいて適切に適用する**。
