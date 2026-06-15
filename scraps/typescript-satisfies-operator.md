---
title: TypeScript の satisfies 演算子が便利
date: 2026-04-10
tags: [TypeScript]
---

`satisfies` 演算子を使うと、型チェックをしつつ型を広げずに推論させられる。

```ts
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// NG: as や明示的な型注釈だと string | number[] になる
palette.green.toUpperCase(); // OK — string として推論される
palette.red.at(0);           // OK — number[] として推論される
```

`as const` との組み合わせも強力。オブジェクトのキーが特定の型に合致することを保証しながら、値の型は可能な限り絞り込める。

ライブラリの設定オブジェクト定義や、定数マップを書くときに重宝している。
