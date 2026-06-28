---
title: ルーティングとデータフェッチ・キャッシュ
date: 2026-06-20
order: 2
draft: false
quiz:
  question: "Next.js 15以降において、オプションを指定せずに fetch('https://api.example.com/data') を呼び出した際のデフォルトのキャッシュ挙動はどれでしょうか？"
  options:
    - "自動的にディスクへキャッシュされる (force-cache)"
    - "キャッシュされず、毎回最新データを取得する (no-store)"
    - "10秒間だけ一時的にメモリへキャッシュされる"
    - "開発環境ではキャッシュされ、本番環境ではキャッシュされない"
  correctIndex: 1
  explanation: "Next.js 15以降では、fetch のデフォルトの挙動が `no-store`（キャッシュしない）になりました。以前のバージョンのようにキャッシュを有効にするには `{ cache: 'force-cache' }` を明示的に指定する必要があります。"
---

Next.js App Router では、フォルダ構造がそのままルーティングになり、コンポーネントの中で非常にシンプルにデータをフェッチできます。さらに、ページの読み込み速度を最大化するために強力なキャッシュ機構が備わっています。

第2章では、App Router のルーティング構造、データ取得方法、そして複雑な「4つのキャッシュ」について図解で解説します。

---

## 1. App Router のルーティング構造

フォルダ名がURLパスになり、そのフォルダ内に配置する特別なファイル名によって役割が決まります。

*   **`page.tsx`**: そのルートの固有UI（ページ本体）。
*   **`layout.tsx`**: 複数のページで共有されるUI（ヘッダー、サイドバーなど）。再レンダリングされず状態が維持されます。
*   **`loading.tsx`**: ページの読み込み中に表示されるローディングUI（自動的にReact Suspenseでラップされます）。
*   **`error.tsx`**: エラー発生時に表示される代替UI。

---

## 2. Server Components でのデータフェッチ

RSC（Server Components）では、コンポーネント自体を `async` 関数にすることで、`useEffect` や `fetch` を使ったフックなしで直接データを非同期で取得できます。

```tsx:app/posts/page.tsx
// サーバーコンポーネントなので、async/await が直接使える
export default async function PostsPage() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  return (
    <div>
      <h1>記事一覧</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. Next.jsの「4つのキャッシュ」と判定フロー（図解）

Next.jsには、パフォーマンス向上とAPIへの負荷を減らすため、4つの独立したキャッシュシステムが存在します。

### キャッシュの概要

| キャッシュ名 | 対象 | 保存場所 | 目的 |
| :--- | :--- | :--- | :--- |
| **Request Memoization** | 同一リクエスト内の `fetch` 重複 | サーバーメモリ | 1回のリクエスト中で同じAPI呼び出しをまとめる |
| **Data Cache** | 異なるリクエスト間のAPIデータ | サーバーのディスク/メモリ | データベースやAPIのデータを保存して再利用する |
| **Full Route Cache** | ページ全体のHTMLとRSC Payload | サーバーのディスク | ビルド時や初回アクセス時に静的にページを丸ごと生成する |
| **Router Cache** | 画面遷移時のページデータ | ブラウザメモリ | ユーザーが画面遷移する際の待ち時間をゼロにする |

### データ取得とキャッシュ判定フロー

```mermaid
flowchart TD
  Req["ページをリクエスト"] --> RC{"1. Router Cache<br>ブラウザ内にキャッシュはあるか?"}
  RC -->|Yes| ClientRender["キャッシュから即座に画面描画 ✅"]
  RC -->|"No (サーバーへリクエスト)"| FRC{"2. Full Route Cache<br>静的生成されたHTMLはあるか?"}
  
  FRC -->|Yes| ReturnHTML["HTML/Payloadを返す"]
  FRC -->|"No (動的処理)"| RM{"3. Request Memoization<br>同一リクエスト内で同じfetchを実行済か?"}
  
  RM -->|Yes| ReturnMemo["メモリから結果を返す"]
  RM -->|No| DC{"4. Data Cache<br>前回のAPI取得データがあるか?"}
  
  DC -->|"Yes (かつ有効期限内)"| ReturnData["ディスクからデータを返す"]
  DC -->|"No (またはキャッシュ無効)"| FetchAPI["実際の外部API / データベースから取得"]
  
  FetchAPI --> SaveDC["Data Cache に保存"]
  SaveDC --> SaveRM["Request Memoization に保存"]
  ReturnHTML --> ClientRender
  ReturnMemo --> ClientRender
  ReturnData --> ClientRender

  style Req fill:#eff6ff,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a
  style ClientRender fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#14532d
```

### キャッシュの制御方法

Next.js 15以降では、`fetch` のデフォルトの挙動はキャッシュしない（`no-store`）仕様へと変更されました。そのため、データをキャッシュして再利用したい場合は、明示的にオプションを指定する必要があります。

```typescript
// キャッシュを強制的に保存する（SSG / キャッシュ再利用向け）
fetch('https://api.example.com/data', { cache: 'force-cache' });

// キャッシュを一切使わず、毎回最新データを取得する（デフォルト動作 / SSR向け）
// ※ Next.js 15以降は明示しなくてもデフォルトで no-store として動作します
fetch('https://api.example.com/data', { cache: 'no-store' });

// 3600秒間（1時間）はキャッシュを再利用し、それを過ぎたらバックグラウンドで再検証する（ISR向け）
fetch('https://api.example.com/data', { next: { revalidate: 3600 } });
```

---

## まとめ

*   **App Router** はフォルダ名がルーティングになり、`layout.tsx` や `page.tsx` を組み合わせてページを組み立てる。
*   **Server Components** では `async/await` を用いて、サーバー上で直接かつ安全にデータを取得可能。
*   Next.jsの **4つのキャッシュ** は、ブラウザ（Router Cache）からサーバーのAPI取得（Data Cache）まで細かく連携し、高速化とサーバー負荷の軽減に貢献している。
