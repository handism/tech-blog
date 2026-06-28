---
title: 実用的な Utility Types と Mapped Types
date: 2026-06-20
order: 3
draft: false
quiz:
  question: "既存のオブジェクト型 T から、指定した一部のキー K を「取り除いた（除外した）」新しい型を作るユーティリティ型はどれでしょうか？"
  options:
    - "Omit<T, K>"
    - "Pick<T, K>"
    - "Exclude<T, U>"
    - "Partial<T>"
  correctIndex: 0
  explanation: "`Omit<T, K>` は型 `T` からプロパティキー `K` を除外した型を生成します。対義語として、指定したキーだけを抽出する場合は `Pick<T, K>` を使用します。"
---

TypeScriptでは、既存の型をベースに新しい型を動的につくり出すための「型ユーティリティ」が標準で多数用意されています。これらを **Utility Types（ユーティリティ型）** と呼びます。

第3章では、日常のWeb開発で多用する重要な Utility Types と、それらの仕組みを支える **Mapped Types（マップ型）** について図解で分かりやすく学びます。

---

## 1. よく使われる代表的な Utility Types

すでに定義したオブジェクトの型を変更して再利用したい場合、一から定義し直すのではなく、以下のユーティリティ型を使用します。

### オブジェクト型を変換する Utility Types

```mermaid
graph TD
  subgraph Original [元の型: User]
    id[id: number]
    name[name: string]
    email[email: string]
  end

  subgraph Partial_Type [Partial&lt;User&gt;]
    id_p[id?: number]
    name_p[name?: string]
    email_p[email?: string]
  end

  subgraph Pick_Type [Pick&lt;User, 'id' | 'name'&gt;]
    id_k[id: number]
    name_k[name: string]
  end

  subgraph Omit_Type [Omit&lt;User, 'email'&gt;]
    id_o[id: number]
    name_o[name: string]
  end

  Original -->|すべてのプロパティをオプションに| Partial_Type
  Original -->|特定のキーのみを抽出| Pick_Type
  Original -->|特定のキーのみを除外| Omit_Type

  style Original fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style Partial_Type fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
  style Pick_Type fill:#faf5ff,stroke:#a855f7,stroke-width:2px,color:#581c87
  style Omit_Type fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#7c2d12
```

---

## 2. 具体的なコード例とユースケース

### ① `Partial<T>`（すべてをオプショナルにする）
API経由でデータを部分更新（PATCH）する場合などに便利です。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// すべてのプロパティが ? (オプショナル) になる
type UpdateUserDto = Partial<User>;
/*
type UpdateUserDto = {
  id?: number;
  name?: string;
  email?: string;
}
*/

const updateUser = (id: number, data: UpdateUserDto) => {
  // 更新処理
};

// name だけ更新したい場合に有効
updateUser(1, { name: "New Name" });
```

### ② `Pick<T, K>` と `Omit<T, K>`（抽出と除外）
「ユーザー登録時のデータ（ID不要）」や「公開プロフィール（メールアドレス除外）」などのパターンで使用します。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

// id と name だけを抽出する
type UserProfile = Pick<User, 'id' | 'name'>;

// isAdmin を除外する
type PublicUser = Omit<User, 'isAdmin'>;
```

### ③ `Record<K, T>`（マップの型定義）
特定のキーセットと特定の値の型をマッピングしたオブジェクト型を作成します。

```typescript
type Page = 'home' | 'about' | 'contact';

interface PageInfo {
  title: string;
}

// 'home' | 'about' | 'contact' をキーとし、PageInfo を値とするオブジェクト
const nav: Record<Page, PageInfo> = {
  home: { title: 'ホーム' },
  about: { title: '会社概要' },
  contact: { title: 'お問い合わせ' },
};
```

---

## 3. Mapped Types（マップ型）の仕組み

なぜ `Partial` や `Readonly` のような型変換ができるのでしょうか？
その背景には、オブジェクトのプロパティをループ処理して新しい型を生成する **Mapped Types（マップ型）** という強力な仕組みがあります。

```typescript
// Mapped Types の基本構文
type MyMappedType<T> = {
  [P in keyof T]: T[P];
};
```

* **`keyof T`**: 型 `T` のすべてのプロパティ名（キー）をユニオン型（例: `'id' | 'name' | 'email'`）として取得します。
* **`P in keyof T`**: そのユニオン型を一つずつループ処理します（JavaScriptの `for (const key in obj)` に似ています）。
* **`T[P]`**: プロパティ `P` に対応する値の型を取得します（ルックアップ型）。

### `Partial<T>` の実装をのぞいてみよう
TypeScriptの標準ライブラリ（`lib.es5.d.ts`）に定義されている `Partial` の実装は以下の通りです。

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]; // ? を付与することで、すべてのプロパティをオプショナルにする
};
```

このように、TypeScriptは単に型に「名前を付ける」だけでなく、プログラムのように「型から新しい型を計算して合成する」ことができるため、非常に高い表現力と安全性を両立できます。
