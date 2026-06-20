---
title: なぜTypeScriptが必要なのか？型消去の仕組み
date: 2026-06-20
order: 1
draft: false
---

現在、多くのWeb開発の現場で JavaScript に代わって **TypeScript（タイプスクリプト）** が標準として採用されています。

第1章では、TypeScriptを導入する根本的な理由と、ブラウザで実行されるまでに型情報がどう扱われるのかという「型消去（Type Erasure）」の仕組みについて図解で解説します。

---

## 1. JavaScriptの課題とTypeScriptの解決策

JavaScriptは **「動的型付け言語」** です。コードが実行されるタイミングで初めてデータの型が決まるため、スペルミスや想定外のデータ型によるバグが、実際に動かすまで（最悪の場合は本番環境でユーザーが使うまで）見つかりにくいという課題があります。

TypeScriptは、JavaScriptの上に **「静的型付け（コンパイル時のチェック）」** のレイヤーを追加した言語です。

*   **エディタの強力な支援**: コードを書いている途中で入力候補（インテリセンス）が表示され、メソッド名の間違いなどをその場でエラーとして指摘してくれます。
*   **ドキュメントとしての型**: 引数や返り値の型が明確になるため、コード自体が信頼できる設計書として機能します。

---

## 2. コンパイルと「型消去」の仕組み（図解）

TypeScriptはそのままではブラウザや Node.js で動かすことができません。実行するには、コンパイラ（`tsc` やビルドツール）を使って JavaScript に変換するプロセスが必要です。

この変換の際、**「TypeScriptの型情報はすべて消去される」** という重要な性質を持っています。

```mermaid
graph TD
  subgraph TS [1. 開発時 (TypeScriptファイル: .ts)]
    Code[ソースコード + 型定義]
    TypeCheck{コンパイラによる<br>型チェック}
    
    Code --> TypeCheck
  end

  subgraph Compilation [2. コンパイル処理 (tsc / esbuild など)]
    RemoveType[型情報の剥ぎ取り]
    Transform[モダンな構文のトランスパイル]
  end

  subgraph JS [3. 実行時 (JavaScriptファイル: .js)]
    PureJS[純粋なJavaScriptコード]
    Browser[ブラウザやNode.jsで実行]
  end

  TypeCheck -->|エラーがなければ変換| Compilation
  Compilation -->|型消去| PureJS
  PureJS --> Browser

  style TS fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style Compilation fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#581c87
  style JS fill:#fef08a,stroke:#eab308,stroke-width:2px,color:#713f12
```

### 型消去（Type Erasure）が意味すること

1.  **実行時のパフォーマンスに影響しない**:
    型チェックはあくまで「コンパイル（変換）するとき」に行われます。生成された JavaScript には型チェックを行うコードは残らないため、型を付けたからといって実行速度が遅くなることはありません。
2.  **実行時に型チェックは行われない**:
    ブラウザ上で動いている時は単なる JavaScript です。そのため、外部APIからの不正なレスポンスや、ユーザー入力による「予期しない型」が実行時に紛れ込むことは防げません。これらはバリデーションライブラリ（Zodなど）を用いて実行時にもチェックする必要があります。

---

## 3. 具体的なコードの比較（Before / After）

型情報がどのように消去されるのか、コンパイル前後のコードを比較すると一目瞭然です。

### コンパイル前（TypeScript）

```typescript:index.ts
interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

const me: User = { id: 1, name: "Handi" };
console.log(greet(me));
```

### コンパイル後（JavaScript）

```javascript:index.js
// interface 定義は完全に消滅する

function greet(user) {
  // 引数 : User や 戻り値 : string の型指定が消去される
  return `Hello, ${user.name}!`;
}

const me = { id: 1, name: "Handi" }; // 変数宣言の : User も消去される
console.log(greet(me));
```

このように、型定義（`interface` や `type`）や型アノテーション（`: string` など）は綺麗に消去され、標準的な JavaScript のコードに変換されていることがわかります。

---

## まとめ

*   TypeScriptはJavaScriptに **静的型チェック** を導入し、バグを未然に防ぎエディタ支援を向上させる。
*   コンパイル時に型チェックが行われた後、型情報はすべて除去されて純粋なJavaScriptに変換される（**型消去**）。
*   実行時には型情報がないため、実行速度は変わらないが、APIレスポンスなどの不確定なデータは実行時の検証（バリデーション）が必要である。

次は、TypeScriptの真骨頂である、再利用性の高い型安全なコードを書くための「ジェネリクス」について学びましょう！
