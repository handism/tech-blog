# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## コマンド

```bash
bun run dev          # 開発サーバー起動
bun run build        # 本番ビルド（静的ファイルを /out に出力）
bun run start        # ビルド済み出力をローカルで配信
bun run lint         # ESLint 実行
bun run test:e2e     # Playwright E2E テスト実行（deployed site 対象）
bun run test:e2e:ui  # E2E テストをインタラクティブ UI で実行
bun run test:unit    # Vitest ユニットテスト実行
bun run analyze      # バンドルサイズ分析（ANALYZE=true でビルド）
```

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。

### コンテンツパイプライン

コンテンツタイプは **ブログ記事**（`md/`）と **Scraps**（`scraps/`）の 2 種類。それぞれ独立した 4 層パイプラインを持つ。

#### ブログ記事（`md/`）

1. `src/lib/post-repository.ts` — ディスクから `.md` ファイルを読み込む
2. `src/lib/post-parser.ts` — `gray-matter` で YAML フロントマターを抽出し、Zod でバリデーション。`markdownToPlaintext()` は export 済みで Scraps でも共用
3. `src/lib/post-renderer.ts` — Remark/Rehype で HTML に変換（GFM・Shiki・TOC 生成）。` ```lang:filename ` 構文でコードブロック上部にファイル名を表示。**コンテンツ非依存のため Scraps も同じ関数を使用**
4. `src/lib/posts-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/` — Next.js App Router ページが `generateStaticParams()` で静的 HTML を生成

#### Scraps（`scraps/`）

1. `src/lib/scrap-repository.ts` — ディスクから `.md` ファイルを読み込む（ENOENT のみ null、他は再 throw）
2. `src/lib/scrap-parser.ts` — 軽量な Zod スキーマ（`title / date / tags / draft` のみ）でバリデーション
3. `src/lib/post-renderer.ts` — ブログ記事と共用（TOC は使用しない）
4. `src/lib/scraps-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/scraps/` — `/scraps`（一覧）・`/scraps/[slug]`（詳細）の 2 ルート

### 主要ディレクトリ

| パス              | 役割                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `md/`             | ブログ記事（`draft/` は下書き・ビルド対象外）                    |
| `scraps/`         | Scraps 記事（短い技術メモ・備忘録）                              |
| `src/lib/`        | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/` | UI コンポーネント（サーバー・クライアント）                      |
| `src/config/`     | サイト全体の設定（著者・ページネーション・スキン等）             |
| `src/types/`      | TypeScript インターフェース（`post.ts`・`scrap.ts`）             |
| `public/images/`  | 記事カバー画像（16:9 比率、`.webp` 推奨）                        |
| `tests/`          | テストファイル（E2E: `*.spec.ts`、ユニット: `*.test.ts`）        |

### フロントマターの形式

#### ブログ記事

```yaml
---
title: 記事タイトル
date: YYYY-MM-DD
tags: [tag1, tag2]
category: カテゴリ名
image: filename.webp
draft: true          # 省略可。本番ビルドで除外される
---
```

省略・不正な値は `siteConfig.posts.defaultTitle` / `defaultCategory` にフォールバック。

#### Scraps

```yaml
---
title: メモのタイトル
date: YYYY-MM-DD
tags: [tag1, tag2]
draft: true          # 省略可
---
```

`category` / `image` / `readingMinutes` は不要（`ScrapMeta` 型 → `src/types/scrap.ts`）。

### 共有ユーティリティ

新しいコンテンツタイプを追加する際は以下を再利用すること：

| ユーティリティ | 場所 | 備考 |
| -------------- | ---- | ---- |
| `markdownToPlaintext()` | `src/lib/post-parser.ts` | Markdown → プレーンテキスト変換。Scraps でも import して使用 |
| `renderPostMarkdown()` | `src/lib/post-renderer.ts` | Markdown → HTML 変換。コンテンツ非依存 |
| `getTagsWithCount()` | `src/lib/post-taxonomy.ts` | `{ tags: string[] }[]` を受け取る汎用型。PostMeta・ScrapMeta どちらも渡せる |
| `getAllTags()` | `src/lib/post-taxonomy.ts` | 同上 |

## コードスタイル

- Prettier：行幅 100 文字、シングルクォート、インデント 2 スペース
- TypeScript strict モード、パスエイリアス `@/*` → プロジェクトルート
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography

## ドキュメント管理ルール

**`.claude/CLAUDE.md` と `README.md` は常に最新の状態を保つこと。** 新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
