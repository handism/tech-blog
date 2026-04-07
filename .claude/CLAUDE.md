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

`md/` 内の Markdown ファイルは以下の順で処理される：

1. `src/lib/post-repository.ts` — ディスクから `.md` ファイルを読み込む
2. `src/lib/post-parser.ts` — `gray-matter` で YAML フロントマターを抽出し、Zod でバリデーション
3. `src/lib/post-renderer.ts` — Remark/Rehype で HTML に変換（GFM・Shiki・TOC 生成）。` ```lang:filename ` 構文でコードブロック上部にファイル名を表示
4. `src/lib/posts-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/` — Next.js App Router ページが `generateStaticParams()` で静的 HTML を生成

### 主要ディレクトリ

| パス              | 役割                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `md/`             | ブログ記事（`draft/` は下書き・ビルド対象外）                    |
| `src/lib/`        | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/` | UI コンポーネント（サーバー・クライアント）                      |
| `src/config/`     | サイト全体の設定（著者・ページネーション・スキン等）             |
| `src/types/`      | TypeScript インターフェース                                      |
| `public/images/`  | 記事カバー画像（16:9 比率、`.webp` 推奨）                        |
| `tests/`          | テストファイル（E2E: `*.spec.ts`、ユニット: `*.test.ts`）        |

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

省略・不正な値は `siteConfig.posts.defaultTitle` / `defaultCategory` にフォールバック。

## コードスタイル

- Prettier：行幅 100 文字、シングルクォート、インデント 2 スペース
- TypeScript strict モード、パスエイリアス `@/*` → プロジェクトルート
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography

## ドキュメント管理ルール

**`.claude/CLAUDE.md` と `README.md` は常に最新の状態を保つこと。** 新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
