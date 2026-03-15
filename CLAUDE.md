# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド（静的ファイルを /out に出力）
npm run start        # ビルド済み出力をローカルで配信
npm run lint         # ESLint 実行
npm run test:e2e     # Playwright E2E テスト実行（deployed site 対象）
npm run test:e2e:ui  # E2E テストをインタラクティブ UI で実行
npm run test:unit    # Vitest ユニットテスト実行
npm run analyze      # バンドルサイズ分析（ANALYZE=true でビルド）
```

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。

### コンテンツパイプライン

`md/` 内の Markdown ファイルは以下の順で処理される：

1. **`src/lib/post-repository.ts`** — ディスクから `.md` ファイルを読み込む
2. **`src/lib/post-parser.ts`** — `gray-matter` で YAML フロントマターを抽出し、**Zod** でバリデーション（不正な値はデフォルト値にフォールバック）
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
| `tests/` | テストファイル（E2E: `*.spec.ts`、ユニット: `*.test.ts`） |

### ルーティング

| ルート | 用途 |
|--------|------|
| `app/page.tsx` | トップページ（記事一覧） |
| `app/blog/posts/[slug]/page.tsx` | 記事詳細 |
| `app/blog/page/[page]/page.tsx` | ページネーション一覧（`/blog/page/1` は `/` にリダイレクト） |
| `app/blog/categories/[category]/page.tsx` | カテゴリ絞り込み |
| `app/blog/tags/[tag]/page.tsx` | タグ絞り込み |

### クライアント / サーバーコンポーネント

- サーバーコンポーネントがデータ取得を担当（ブログルート）
- クライアントコンポーネント（`'use client'`）はインタラクティブな UI に使用：`Header`・`SearchBox`・`ThemeToggle`・`ImageModal`・`CopyButtonScript`
- ダークモードは `next-themes` によるクラスベースの切り替えで管理

### SEO・メタデータ

- `app/layout.tsx` にサイト全体のデフォルト OGP（`og:title`、`og:description`、Twitter Card）を設定
- 記事ページ（`app/blog/posts/[slug]/page.tsx`）は `generateMetadata` で記事固有の OGP と `og:type: article` を設定
- 各記事ページには **JSON-LD**（`BlogPosting` スキーマ）を埋め込み
- Sitemap（`app/sitemap.xml/route.ts`）は記事・カテゴリ・タグ・ページネーションページを含み、`lastmod` 付きで出力

### アクセシビリティ

- `Header` の Tools ドロップダウンは ARIA menu パターンに準拠（矢印キー・Escape キー操作対応）
- `ThemeToggle` には `aria-label`（「ダークモードに切り替え」/「ライトモードに切り替え」）を設定
- `:focus-visible` スタイルをアクセント色で定義（`app/globals.css`）

### テスト構成

| 種別 | ファイル | 実行コマンド |
|------|----------|-------------|
| E2E（Playwright） | `tests/*.spec.ts` | `npm run test:e2e` |
| ユニット（Vitest） | `tests/*.test.ts` | `npm run test:unit` |

- E2E テスト対象：記事詳細表示・OGP タグ・検索・ページネーション・ダークモード
- ユニットテスト対象：`tagToSlug` / `categoryToSlug`（`src/lib/utils.ts`）

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

フロントマターは Zod でバリデーションされる。省略・不正な値はデフォルト値（`siteConfig.posts.defaultTitle` / `defaultCategory`）にフォールバック。

## コードスタイル

- Prettier：行幅 100 文字、シングルクォート、インデント 2 スペース
- TypeScript strict モード、パスエイリアス `@/*` → プロジェクトルート
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography
