# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド（静的ファイルを /out に出力）
npm run start        # ビルド済み出力をローカルで配信
npm run lint         # ESLint 実行
npm run test:e2e     # Playwright E2E テスト実行
npm run test:e2e:ui  # E2E テストをインタラクティブ UI で実行
```

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。

### コンテンツパイプライン

`md/` 内の Markdown ファイルは以下の順で処理される：

1. **`src/lib/post-repository.ts`** — ディスクから `.md` ファイルを読み込む
2. **`src/lib/post-parser.ts`** — `gray-matter` で YAML フロントマター（title, date, tags, category, image）を抽出
3. **`src/lib/post-renderer.ts`** — Remark/Rehype（GFM・Shiki シンタックスハイライト・見出し slug/自動リンク・TOC 生成）で Markdown を HTML に変換
4. **`src/lib/posts-server.ts`** — React `cache()` でデータを集約し SSG に対応。`getAllPostMeta()` と `getPost(slug)` をエクスポート
5. **`app/`** — Next.js App Router ページが上記を呼び出し、`generateStaticParams()` で静的 HTML を生成

### 主要ディレクトリ

| パス | 役割 |
|------|------|
| `md/` | ブログ記事の Markdown ファイル |
| `md/draft/` | 下書き記事（ビルド対象外） |
| `src/lib/` | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/` | UI コンポーネント（サーバー・クライアント） |
| `src/config/` | サイト全体の設定（著者・ページネーション・GitHub URL） |
| `src/types/` | TypeScript インターフェース（`Post`・`PostMeta`・`TocItem`） |
| `public/images/` | 記事カバー画像（16:9 比率、`.webp` 推奨） |
| `tests/` | Playwright E2E テスト |

### ルーティング

| ルート | 用途 |
|--------|------|
| `app/page.tsx` | トップページ（記事一覧） |
| `app/blog/posts/[slug]/page.tsx` | 記事詳細 |
| `app/blog/page/[page]/page.tsx` | ページネーション一覧 |
| `app/blog/categories/[category]/page.tsx` | カテゴリ絞り込み |
| `app/blog/tags/[tag]/page.tsx` | タグ絞り込み |

### クライアント / サーバーコンポーネント

- サーバーコンポーネントがデータ取得を担当（ブログルート）
- クライアントコンポーネント（`'use client'`）はインタラクティブな UI に使用：`Header`・`SearchBox`・`ThemeToggle`・`ImageModal`・`CopyButtonScript`
- ダークモードは `next-themes` によるクラスベースの切り替えで管理

### 記事フロントマターの形式

```yaml
---
title: 記事タイトル
date: YYYY-MM-DD
tags: [tag1, tag2]
category: カテゴリ名
image: filename.webp
---
```

## コードスタイル

- Prettier：行幅 100 文字、シングルクォート、インデント 2 スペース
- TypeScript strict モード、パスエイリアス `@/*` → `src/*`
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography
