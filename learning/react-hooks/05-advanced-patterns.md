---
title: 高度なフックとReact 19のデータ処理
date: 2026-07-12
order: 5
draft: false
quiz:
  question: "Reactにおいて、大きなリストのフィルタ処理などの重い状態更新を「低優先度」に設定し、ユーザーのタイピング入力などの即時レスポンスを妨げないように制御するフックは何でしょうか？"
  options:
    - "useTransition"
    - "useLayoutEffect"
    - "useImperativeHandle"
    - "useSyncExternalStore"
  correctIndex: 0
  explanation: "useTransition を使うと、特定の状態更新を「トランジション（緊急ではない処理）」としてラップできます。これにより、ブラウザの描画がブロックされず、ユーザーの入力（タイピングやクリック）に対する即時のフィードバックが優先して処理されます。"
---

Reactアプリケーションの複雑度が増すにつれて、単純な `useState` と `useEffect` だけでは、パフォーマンスやデータ更新のUX（ユーザー体験）を良好に保つことが難しくなります。特にUIのレスポンス性を損なわずに非同期データ処理を行うため、ReactはトランジションAPIやReact 19で新たなフックを導入しました。

第5章では、アプリケーションを次のレベルに引き上げる高度なフックとReact 19の新機能について学びます。

---

## 1. トランジションAPI (useTransition / useDeferredValue)

通常、Reactの状態（state）が変わると、Reactは即座に再レンダリングを実行し、完了するまでブラウザの描画をブロックします。そのため、重い処理があると画面がフリーズしたように感じられます。

**`useTransition`** は、状態更新の優先度を「緊急ではない（Transition）」ものとして扱うためのフックです。

```javascript
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  // 高優先度: 入力欄のテキスト変更は即座に反映させる
  setInputValue(e.target.value);

  // 低優先度: フィルタリングされた重いリストの再計算はバックグラウンドで行う
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
};
```

* **`isPending`**: トランジションがバックグラウンドで処理中（実行中）であるかどうかを示すブーリアン値です。これを使ってローディングスピナーなどを表示できます。
* **`useDeferredValue`**: `useTransition` が「状態更新を行う関数」をラップするのに対し、受け取った「値」自体の更新を遅延させるフックです。

---

## 2. React 19 の非同期アクション用フック

React 19では、非同期処理（データ送信や更新）に伴うローディング状態やエラーハンドリングを簡素化するために、**「アクション（Actions）」** という概念と専用のフックが追加されました。

```mermaid
graph TD
  A[フォーム送信サブミット] --> B[useActionState が非同期関数を実行]
  B --> C{送信中?}
  C -- Yes --> D[isPending: true <br> 送信ボタンを非活性化]
  C -- No --> E[処理結果 / エラー状態を返却]

  style B fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
  style D fill:#fff7ed,stroke:#f97316,stroke-width:2px
```

### `useActionState` (旧 useFormState)
フォーム送信などの非同期処理を扱う際、これまで手動で管理していた `isLoading` や `error` のステートを自動的に管理します。

```tsx
// React 19 アクションフックの例
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    try {
      await updateProfile(formData.get("name"));
      return { success: true, error: null };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  { success: false, error: null }
);

return (
  <form action={formAction}>
    <input name="name" type="text" />
    <button type="submit" disabled={isPending}>
      {isPending ? "保存中..." : "保存"}
    </button>
    {state.error && <p>{state.error}</p>}
  </form>
);
```

### `useOptimistic` (楽観的更新)
サーバーへのリクエストが完了する前に、**「おそらく成功するだろう」** と予測して、UI上に即座に変更結果を反映させる「楽観的更新（Optimistic Updates）」をシンプルに実現するフックです。
送信が完了すると本番のデータと自動的に置き換わり、失敗した場合は元の状態へ自動ロールバックされます。

---

## 3. useSyncExternalStore

Reactの管轄外にある外部のデータストア（Reduxなどの独自状態管理ライブラリ、ブラウザの `window.navigator.onLine` やメディアクエリ `window.matchMedia` など）と、Reactのコンポーネントの状態を安全に同期・サブスクライブするためのフックです。

`useEffect` を使った手動同期で発生しがちだった、レンダリング中の一貫性の欠如（テイアリング現象）を防ぎ、並行レンダリング（Concurrent Mode）において安全に動作することを保証します。
