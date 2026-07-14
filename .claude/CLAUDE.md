# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## コマンド

```bash
bun run dev              # 開発サーバー起動（前処理で scripts/download-fonts.js を実行）
bun run build            # 本番ビルド（静的ファイルを /out に出力）
bun run start            # ビルド済み /out をローカルで配信
bun run lint             # ESLint 実行
bun run type-check       # TypeScript 型チェック（tsc --noEmit）
bun run test:unit        # Vitest ユニットテスト実行
bunx vitest run tests/post-parser.test.ts   # 単一テストファイルの実行
bun run test:vrt         # Playwright VRT（全テーマのスクリーンショット比較。事前に bun run build が必要）
bun run test:vrt:update  # VRT スナップショット更新
bun run analyze          # バンドルサイズ分析（ANALYZE=true でビルド）
```

- VRT は `out/` を `serve` で配信して実行するため、**先に `bun run build` を済ませておくこと**（対象: `tests/vrt.test.ts`、Vitest からは除外済み）。
- コミット時は `simple-git-hooks` + `lint-staged` により、ステージ済み JS/TS ファイルへの `eslint --fix` とプロジェクト全体の `type-check` が自動実行され、型エラーがあるとコミットがブロックされる。フックは `bun install` 時に自動セットアップ（手動再設定は `bunx simple-git-hooks`）。

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。`main` へのプッシュで GitHub Actions が自動デプロイ。

### コンテンツパイプライン

コンテンツタイプは **ブログ記事**（`md/`）・**Scraps**（`scraps/`）・**学習ガイド**（`learning/`）・**AWS Patterns**（`patterns/`）の 4 種類。それぞれ独立したパイプラインを持つが、下位層を共有する。

#### ブログ記事（`md/`）

1. `src/lib/post-repository.ts` — `createMarkdownRepository()`（`src/lib/markdown-repository.ts`）でディスクから `.md` を読み込む
2. `src/lib/post-parser.ts` — `gray-matter` で YAML フロントマターを抽出し、Zod でバリデーション。`markdownToPlaintext()` は export 済みで他コンテンツタイプでも共用
3. `src/lib/post-renderer.ts` — Remark/Rehype で HTML に変換（GFM・Shiki・TOC 生成・Mermaid パース）。` ```lang:filename ` 構文でコードブロック上部にファイル名を表示。**コンテンツ非依存のため Scraps・学習ガイドも同じ関数を使用**
4. `src/lib/posts-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/blog/` — `generateStaticParams()` で静的 HTML を生成（posts / categories / tags）

#### Scraps（`scraps/`）

1. `src/lib/scrap-repository.ts` — `createMarkdownRepository()` を共用（ENOENT のみ null、他は再 throw）
2. `src/lib/scrap-parser.ts` — 軽量な Zod スキーマ（`title / date / tags / draft` のみ）でバリデーション
3. `src/lib/post-renderer.ts` — ブログ記事と共用（TOC は使用しない）
4. `src/lib/scraps-server.ts` — React `cache()` でデータを集約
5. `app/scraps/` — `/scraps` の 1 ルート（一覧＋本文インライン展開。個別詳細ページはない）

#### 学習ガイド（`learning/`）

1. `src/lib/learning-repository.ts` — コースごとのディレクトリを走査し、`meta.json` と `.md` を読み込む
2. `src/lib/learning-parser.ts` — Zod スキーマ（`title / date / order / draft / quiz`）でバリデーション
3. `src/lib/post-renderer.ts` — 共用（Mermaid コードブロックは Shiki をバイパスして生の HTML `div` になり、クライアント側の `MermaidRenderer` が SVG 描画）
4. `src/lib/learning-server.ts` — React `cache()` で集約し、`order` 昇順ソートと隣接チャプターを解決
5. `app/learning/` — `/learning`（コース一覧）・`/learning/[course]`（ロードマップ）・`/learning/[course]/[slug]`（チャプター詳細）の 3 ルート
6. クライアント側機能：LocalStorage による読了進捗管理（`src/hooks/useLearningProgress.ts`）とチャプター末尾の理解度クイズ（`ChapterQuiz`）

#### AWS Patterns（`patterns/`）

1. `patterns/gallery-meta.json` — 全パターンのメタデータを一括管理（`src/types/aws-gallery.ts` の Zod スキーマでバリデーション）
2. `src/lib/aws-gallery-repository.ts` — メタデータと `patterns/iac/*.yaml` テンプレートを読み込み、アセット（YAML・`patterns/img/*.drawio.svg`）を更新日時比較で `public/patterns/` に自動コピー
3. `src/lib/aws-gallery-server.ts` — React `cache()` で集約し、YAML を Shiki でハイライト済み HTML に事前生成
4. `app/patterns/` — `/patterns`（一覧）・`/patterns/[slug]`（詳細）の 2 ルート

#### その他のパイプライン

- **検索**：`src/lib/kuromoji-tokenizer.ts` の文字種ベース簡易分かち書き（ビルド時・クライアントで同一ロジック）＋ `src/components/SearchBox.tsx` の Fuse.js クライアント全文検索。検索インデックスは `app/search.json` で生成
- **OGP 画像**：`scripts/download-fonts.js` が日本語フォントとアバターをダウンロード（失敗時はダミー/外部 URL にフォールバック）→ `app/og/[slug]/image.png/route.tsx` が `ImageResponse` + `generateStaticParams()` でビルド時に全記事の PNG を静的生成

### 主要ディレクトリ

| パス               | 役割                                                             |
| ------------------ | ---------------------------------------------------------------- |
| `md/`              | ブログ記事（`draft/` は下書き・ビルド対象外。`template/` にひな形あり） |
| `scraps/`          | Scraps 記事（短い技術メモ・備忘録）                              |
| `learning/`        | 学習ガイド（コースごとのフォルダ＋`meta.json`＋章別 `.md`）      |
| `patterns/`        | AWS Patterns（`gallery-meta.json`・`iac/*.yaml`・`img/*.drawio.svg`） |
| `src/lib/`         | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/`  | UI コンポーネント（サーバー・クライアント。ツール類は `tools/`、テーマ演出は `theme-effects/`） |
| `src/hooks/`       | カスタムフック（クリップボード・学習進捗・TOC 監視など）        |
| `src/config/`      | 設定値。`site.ts`（著者・ページネーション等）／`themes.ts`（テーマカタログと `DEFAULT_THEME`）／`layout.ts`（一覧レイアウト）／`tools.ts`（ツールメニュー項目）に関心事ごとに分割 |
| `src/types/`       | TypeScript インターフェース（`post.ts`・`scrap.ts`・`learning.ts`・`aws-gallery.ts`） |
| `public/images/`   | 記事カバー画像（16:9 比率、`.webp` 推奨）                        |
| `app/tools/`       | ブラウザ完結型ツール群のルート                                   |
| `tests/`           | テストファイル（ユニット: `*.test.ts`、VRT: `vrt.test.ts` + スナップショット） |
| `.agents/designs/` | デザインテーマごとの詳細設計書（`DESIGN_*.md`）                  |

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

#### 学習ガイド

コースフォルダ直下の `meta.json`：

```json
{ "title": "コースタイトル", "description": "コースの説明文", "emoji": "🐳" }
```

各チャプター（`.md`）のフロントマター：

```yaml
---
title: チャプタータイトル
date: YYYY-MM-DD     # 省略可
order: 1             # コース内の並び順（必須）
draft: true          # 省略可
quiz:                # 確認クイズ（省略可）
  question: "質問文"
  options: ["選択肢1", "選択肢2"]
  correctIndex: 0
  explanation: "解説文"
---
```

### 共有ユーティリティ

新しいコンテンツタイプ・ツールを追加する際は以下を再利用すること：

| ユーティリティ | 場所 | 備考 |
| -------------- | ---- | ---- |
| `createMarkdownRepository()` | `src/lib/markdown-repository.ts` | ディレクトリから `.md` を読むリポジトリのファクトリ。パストラバーサル対策込み |
| `markdownToPlaintext()` | `src/lib/post-parser.ts` | Markdown → プレーンテキスト変換。Scraps・学習ガイドでも import して使用 |
| `renderPostMarkdown()` | `src/lib/post-renderer.ts` | Markdown → HTML 変換。コンテンツ非依存 |
| `getTagsWithCount()` / `getAllTags()` | `src/lib/post-taxonomy.ts` | `{ tags: string[] }[]` を受け取る汎用型。PostMeta・ScrapMeta どちらも渡せる |
| `resolveSlugOrNotFound()` | `src/lib/slug-resolver.ts` | スラッグ → 元値の解決。見つからなければ `notFound()` |
| `ToolTabsPage` | `src/components/ToolTabsPage.tsx` | タブ切り替え型ツールページの共通レイアウト。`app/tools/*/page.tsx` は `SUB_TOOLS` 定義＋このコンポーネント呼び出しのみとし、タブ UI・クエリパラメータ処理・Suspense 境界はここに集約する |
| `CopyButton` | `src/components/CopyButton.tsx` | コピー実行＋「コピー完了」表示切り替えを内包した汎用ボタン。`src/components/tools/` 配下でクリップボードコピーが必要な箇所は個別に `useCopyToClipboard` を呼ばずこれを使う。キーボードショートカット等ボタンクリック以外からコピーを発火させたい場合のみ `useCopyToClipboard` を直接使用する |

## コードスタイル

- Prettier：行幅 100 文字、シングルクォート、インデント 2 スペース
- TypeScript strict モード、パスエイリアス `@/*` → プロジェクトルート
- `any` / `as any` は禁止（`@typescript-eslint/no-explicit-any` でビルドがブロックされる）
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography

## テーマシステム開発ガイドライン

サイト全体で複数のデザインテーマ（`src/config/themes.ts` で管理、デフォルトは `DEFAULT_THEME`）を採用。テーマは `data-theme` 属性で切り替わり、対応する CSS 変数が `app/globals.css` でオーバーライドされる。テーマ固有の演出は `src/components/theme-effects/` に分割され、`ThemeEffectManager.tsx` が統括する。

テーマの修正・追加時は以下を遵守すること：

- 実装前に `.agents/designs/DESIGN_*.md` の該当テーマ詳細仕様書を参照する
- **ライトモードとダークモードの両方**で表示を検証する。背景グラデーションを上書きする際は `isDark` で動的に配色を切り替えるか `bg-transparent` で CSS 側の `body` 背景を透過させる
- テーマ別 CSS は必ず `[data-theme='theme-name']` でスコープし、他テーマを汚染しない。カード（`.theme-card`）の枠外に要素を置く場合は `overflow: hidden` との干渉を検証する
- コミット前に `bun run lint`・`bun run type-check`・`bun run build` を通す

## 言語・コミュニケーション設定

- ユーザーとの会話、および作成するドキュメント（`implementation_plan.md`、`walkthrough.md`、`task.md` などの計画・進捗管理用ファイルを含む）は、原則として**日本語**で記述・作成してください。

## ドキュメント管理ルール

**`.claude/CLAUDE.md` と `README.md` は常に最新の状態を保つこと。** 新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
