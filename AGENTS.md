# AGENTS.md

このファイルは、リポジトリ内のコードを扱う際に Antigravity へ提供するガイダンスです。

## コマンド

```bash
bun run dev          # 開発サーバー起動
bun run build        # 本番ビルド（静的ファイルを /out に出力）
bun run start        # ビルド済み出力をローカルで配信
bun run lint         # ESLint 実行
bun run test:unit    # Vitest ユニットテスト実行
bun run analyze      # バンドルサイズ分析（ANALYZE=true でビルド）
```

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。

### コンテンツパイプライン

コンテンツタイプは **ブログ記事**（`md/`）、**Scraps**（`scraps/`）、および **学習ガイド**（`learning/`）の 3 種類。それぞれ独立したパイプラインを持つ。

#### ブログ記事（`md/`）

1. `src/lib/post-repository.ts` — ディスクから `.md` ファイルを読み込む
2. `src/lib/post-parser.ts` — `gray-matter` で YAML フロントマターを抽出し、Zod でバリデーション。`markdownToPlaintext()` は export 済みで Scraps でも共用
3. `src/lib/post-renderer.ts` — Remark/Rehype で HTML に変換（GFM・Shiki・TOC 生成・Mermaidパース）。` ```lang:filename ` 構文でコードブロック上部にファイル名を表示。**コンテンツ非依存のため Scraps も同じ関数を使用**
4. `src/lib/posts-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/` — Next.js App Router ページが `generateStaticParams()` で静的 HTML を生成

#### Scraps（`scraps/`）

1. `src/lib/scrap-repository.ts` — ディスクから `.md` ファイルを読み込む（ENOENT のみ null、他は再 throw）
2. `src/lib/scrap-parser.ts` — 軽量な Zod スキーマ（`title / date / tags / draft` のみ）でバリデーション
3. `src/lib/post-renderer.ts` — ブログ記事と共用（TOC は使用しない）
4. `src/lib/scraps-server.ts` — React `cache()` でデータを集約し SSG に対応
5. `app/scraps/` — `/scraps`（一覧・本文インライン展開）の 1 ルート

#### 学習ガイド（`learning/`）

1. `src/lib/learning-repository.ts` — ディスクからコースごとのディレクトリを走査し、`meta.json` と `.md` ファイルを読み込む
2. `src/lib/learning-parser.ts` — Zod スキーマ（`title / date / order / draft / quiz`）でバリデーション。`markdownToPlaintext()` は共用
3. `src/lib/post-renderer.ts` — ブログ記事と共用（Mermaidコードブロックは Shiki をバイパスして生の HTML `div` に変換され、クライアントサイドで動的にSVG描画される）
4. `src/lib/learning-server.ts` — React `cache()` でデータを集約し、`order` 昇順ソートと隣接チャプターを解決
5. `app/learning/` — `/learning`（コース一覧）・`/learning/[course]`（ロードマップ）・`/learning/[course]/[slug]`（詳細）の 3 ルート。`generateStaticParams()` で静的 HTML を生成。2026年6月に「システムデザイン」「Gitアドバンスド」「AWSクラウド」「フロントエンドテスト」「モダンCSS」などのコースを新規追加。
6. クライアントサイドでの動的機能として、LocalStorageを利用した学習進捗管理（読了チェック）およびチャプター末尾の「理解度クイズ」インタラクティブコンポーネントを搭載。

#### AWSアーキテクチャ・ギャラリー（`aws-patterns/`）

1. `aws-patterns/gallery-meta.json` — メタデータを一括管理（タイトル、概要、カテゴリ、使用サービス、ファイル名マッピング）
2. `src/types/aws-gallery.ts` — Zod スキーマ（`slug / title / description / category / templateFile / diagramFile / awsServices`）でバリデーション
3. `src/lib/aws-gallery-repository.ts` — メタデータおよび `.yaml` テンプレートファイルの読み込み。同時にアセットを `/public/aws-patterns/` に自動コピー
4. `src/lib/aws-gallery-server.ts` — React `cache()` でデータを集約し、YAMLを Shiki によるハイライトHTMLに事前生成
5. `app/aws-patterns/` — `/aws-patterns`（一覧）・`/aws-patterns/[slug]`（詳細）ルート。`generateStaticParams()` で静的 HTML を生成

### 主要ディレクトリ

| パス              | 役割                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `.agents/`        | エージェント用ガイダンス（rules, designs, workflows, skills等）   |
| `.agents/designs/`| 12種類のデザインテーマごとの詳細設計書（`DESIGN_*.md`）          |
| `aws-patterns/`   | AWSアーキテクチャパターン（CloudFormationテンプレート、Draw.io図、メタデータJSON） |
| `md/`             | ブログ記事（`draft/` は下書き・ビルド対象外）                    |
| `scraps/`         | Scraps 記事（短い技術メモ・備忘録）                              |
| `learning/`       | 学習ガイド記事（コースごとのフォルダと meta.json を含む構造）      |
| `src/lib/`        | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/` | UI コンポーネント（サーバー・クライアント）                      |
| `src/hooks/`      | 状態管理用のカスタムフック（学習進捗管理など）                   |
| `src/config/`     | サイト全体の設定（著者・ページネーション・スキン等）             |
| `src/types/`      | TypeScript インターフェース（`post.ts`・`scrap.ts`・`learning.ts`・`aws-gallery.ts`） |
| `public/images/`  | 記事カバー画像（16:9 比率、`.webp` 推奨）                        |
| `app/tools/`      | オンライン便利ツール（`/tools`）および各ツールの個別ページルート（全51種） |
| `tests/`          | テストファイル（ユニット: `*.test.ts`）        |

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

##### meta.json (コース設定)
```json
{
  "title": "コースタイトル",
  "description": "コースの説明文",
  "emoji": "🐳"
}
```

##### チャプター記事 (.md)
```yaml
---
title: チャプターのタイトル
date: YYYY-MM-DD      # 省略可
order: 1             # コース内の並び順 (必須)
draft: true          # 省略可
quiz:                # 確認クイズ (省略可)
  question: "質問文"
  options:
    - "選択肢1"
    - "選択肢2"
  correctIndex: 0
  explanation: "解説文"
---
```

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
- サイト全体で **30種類の多彩なデザインテーマ（デフォルトはNeo-Brutalism）** を採用したフレキシブルなスタイリングシステムを導入：
  - 各テーマ（Neo-Brutalism, Glassmorphism, Minimal, ..., Bento, Hekireki など30種類）は `app/globals.css` で CSS 変数として定義され、`data-theme` 属性で切り替わります。
  - 共通のUIパーツ（カード、ボタン、入力エリア）には、選択されたテーマに応じた専用のスタイル（ボーダー、シャドウ、エフェクト）が自動適用されます。
  - 見出し等のタイポグラフィには Google Fonts からインポートした **Lexend** と **Space Grotesk** を優先して割り当てる設計です。
  - 新しいコンポーネントの実装やテーマ別のスタイリング調整を行う際は、`.agents/designs/DESIGN_*.md` の各テーマ詳細仕様書を参照してください。

## 品質保証 (Git Hooks)

CIの破壊を防ぐため、`simple-git-hooks` と `lint-staged` によるコミット前チェックが導入されています。

- **プレコミット時自動チェック**:
  - コミットしようとした（ステージングされた）`.ts`, `.tsx`, `.js`, `.jsx` ファイルに対して自動的に `eslint --fix` が走り、コードスタイル（Prettier含む）が修正されます。
  - プロジェクト全体に対して `bun run type-check` (`tsc --noEmit`) が実行され、型エラーがある場合はコミットがブロックされます。
- **フックの有効化**:
  - パッケージインストール時（`bun install`）に `prepare` スクリプトによって自動的にフックがセットアップされます。
  - 手動で再セットアップする場合は `bunx simple-git-hooks` を実行してください。


## 言語・コミュニケーション設定

- ユーザーとの会話、および作成するドキュメント（`implementation_plan.md`、`walkthrough.md`、`task.md` などの計画・進捗管理用ファイルを含む）は、原則として**日本語**で記述・作成してください。

## ドキュメント管理ルール

**`AGENTS.md` と `README.md` は常に最新の状態を保つこと。** 新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
