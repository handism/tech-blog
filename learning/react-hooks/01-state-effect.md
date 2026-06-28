---
title: useState と useEffect のライフサイクル
date: 2026-06-20
order: 1
draft: false
quiz:
  question: "useEffect で「クリーンアップ関数（Effect内のreturn関数）」が実行される正しいタイミングはどれでしょうか？"
  options:
    - "初回のレンダリングが完了した直後のみ"
    - "コンポーネントが再レンダリングされる直前（次のEffect実行前）およびコンポーネントのアンマウント時"
    - "useState の値が変更される直前"
    - "ページ全体の JavaScript の読み込みが完了した時"
  correctIndex: 1
  explanation: "クリーンアップ関数は、コンポーネントが画面から消えるとき（アンマウント）、または依存配列が変化して次の新しい副作用（Effect）が実行される「直前」に、古い状態のメモリやリスナーをクリアするために呼び出されます。"
---

React の機能である **Hooks（フック）** は、関数コンポーネントの中で状態管理や副作用（API通信、DOM操作など）を扱うための仕組みです。

第1章では、最も頻繁に使用される `useState` と `useEffect` を取り上げ、コンポーネントがどのように「レンダリング」され、「副作用が実行されるか」というライフサイクルの流れを図解で学びます。

---

## 1. useState による状態管理の基本

`useState` は、コンポーネント内に「状態（State）」を持たせるためのフックです。状態が更新されると、Reactはコンポーネントを再レンダリング（再描画）します。

```tsx
const [count, setCount] = useState<number>(0);
```

* **`count` (状態変数)**: 現在保持されている値です。
* **`setCount` (更新関数)**: 値を更新するための関数です。これを使って値を変更すると、Reactに再レンダリングがトリガーされます。

---

## 2. useEffect のライフサイクルと実行タイミング

`useEffect` は、レンダリング結果が画面に反映された「後」に実行される副作用（Side Effect）を定義します。

### 実行の流れ（ライフサイクル）

```mermaid
graph TD
  subgraph RenderPhase [1. レンダリング・マウント]
    Render[コンポーネントが評価される]
    DOM[DOMに反映される <br> 画面の更新]
    Render --> DOM
  end

  subgraph EffectPhase [2. 副作用の実行]
    Effect[useEffect の実行]
    DOM -->|画面更新の直後| Effect
  end

  subgraph UpdatePhase [3. 状態更新 / 再レンダリング]
    StateChange[状態が変更される]
    ReRender[再レンダリング実行]
    DOMUpdate[DOMが更新される]
    Cleanup[前回のクリーンアップ実行]
    NewEffect[新しい useEffect の実行]

    StateChange --> ReRender
    ReRender --> DOMUpdate
    DOMUpdate -->|副作用の実行前| Cleanup
    Cleanup --> NewEffect
  end

  subgraph UnmountPhase [4. アンマウント時]
    Destroy[コンポーネントの破棄]
    FinalCleanup[クリーンアップの最終実行]
    Destroy --> FinalCleanup
  end

  style RenderPhase fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style EffectPhase fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
  style UpdatePhase fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#581c87
  style UnmountPhase fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
```

### 依存配列（Dependencies）による制御

`useEffect` の第2引数に渡す配列によって、実行タイミングを制御できます。

| 依存配列の指定 | 実行されるタイミング |
| :--- | :--- |
| **指定なし** (`useEffect(() => {})`) | **毎回のレンダリング後** に常に実行される |
| **空の配列** (`useEffect(() => {}, [])`) | **初回のマウント時（画面表示時）のみ** 実行される |
| **値あり** (`useEffect(() => {}, [count])`) | 初回マウント時 ＆ **`count` の値が変わったときのみ** 実行される |

---

## 3. クリーンアップ関数（Cleanup）の重要性

`useEffect` 内でイベントリスナーの登録やタイマーの設置（`setInterval`）を行った場合、コンポーネントが消える（アンマウント）前や、次の副作用が実行される前に、それらを解除（クリーンアップ）する必要があります。

これを怠ると、**メモリリーク** や予期しないバグの原因になります。

### クリーンアップの書き方

```tsx
import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 1秒ごとにカウントアップするタイマーをセット
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // クリーンアップ関数を返す
    return () => {
      clearInterval(intervalId); // コンポーネント消滅時や再実行前にタイマーを解除
      console.log('タイマーが解除されました');
    };
  }, []); // 空の配列なので、マウント時に1回だけタイマーをセット

  return <div>起動時間: {seconds} 秒</div>;
}
```

コンポーネブラウザ上で非表示になる際、Reactは自動的にこの返された関数（`() => clearInterval(intervalId)`）を呼び出して、タイマーをストップします。

次のチャプターでは、これらを応用して独自のロジックを切り出す「カスタムフック」について学びます！
