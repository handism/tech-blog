---
title: Next.js で fetch キャッシュが効きすぎて困ったメモ
date: 2026-04-12
tags: [Next.js, デバッグ]
---

App Router の `fetch` はデフォルトで積極的にキャッシュされる。開発中に API レスポンスが古いまま返ってきて原因究明に時間がかかった。

## 解決策

キャッシュを無効にしたい場合は `cache: 'no-store'` を渡す。

```ts
const res = await fetch('/api/data', { cache: 'no-store' });
```

再検証間隔を指定したい場合は `next.revalidate` を使う。

```ts
const res = await fetch('/api/data', { next: { revalidate: 60 } }); // 60秒ごと
```

## 落とし穴

`generateStaticParams` 内の fetch は SSG 時に 1 度だけ実行される。動的データを使いたい場合は Route Handler 経由にする必要がある。

React の `cache()` と Next.js の fetch キャッシュは別物なので混同しないように注意。
