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
5. `app/learning/` — `/learning`（コース一覧）・`/learning/[course]`（ロードマップ）・`/learning/[course]/[slug]`（詳細）の 3 ルート。`generateStaticParams()` で静的 HTML を生成。
   - 提供中の全17コース:
     - `docker` (Docker)
     - `github` (GitHub)
     - `web-security` (Webセキュリティ)
     - `api-design` (API設計)
     - `linux-bash` (Linux & Bash)
     - `network-basics` (ネットワークの基本)
     - `cicd-pipeline` (CI/CDパイプライン)
     - `system-design` (システムデザイン)
     - `git-advanced` (Gitアドバンスド)
     - `cloud-aws` (AWSクラウド)
     - `frontend-testing` (フロントエンドテスト)
     - `modern-css` (モダンCSS)
     - `database` (データベース)
     - `nextjs` (Next.js)
     - `performance` (パフォーマンス)
     - `react-hooks` (React Hooks)
     - `typescript` (TypeScript)
6. クライアントサイドでの動的機能として、LocalStorageを利用した学習進捗管理（読了チェック）およびチャプター末尾の「理解度クイズ」インタラクティブコンポーネントを搭載。

#### AWSアーキテクチャ・ギャラリー（`aws-patterns/`）

1. `aws-patterns/gallery-meta.json` — メタデータを一括管理（タイトル、概要、カテゴリ、使用サービス、ファイル名マッピング）
2. `src/types/aws-gallery.ts` — Zod スキーマ（`slug / title / description / category / templateFile / diagramFile / awsServices`）でバリデーション
3. `src/lib/aws-gallery-repository.ts` — メタデータおよび `.yaml` テンプレートファイルの読み込み。同時にアセットを `/public/aws-patterns/` に自動コピー
4. `src/lib/aws-gallery-server.ts` — React `cache()` でデータを集約し、YAMLを Shiki によるハイライトHTMLに事前生成
5. `app/aws-patterns/` — `/aws-patterns`（一覧）・`/aws-patterns/[slug]`（詳細）ルート。`generateStaticParams()` で静的 HTML を生成
   - 提供中の全16パターン（カテゴリ別）:
     - `bedrock-rag-serverless` (AI & Integration) ★新規
     - `mcp-server` (AI & Integration)
     - `cost-optimized-serverless` / `serverless-api` (Serverless)
     - `stepfunctions-eventdriven-batch` (Serverless) ★新規
     - `streaming-architecture` (Analytics)
     - `container-orchestration` (Containers)
     - `ha-pattern` / `high-availability-architecture` (High Availability)
     - `three-tier-architecture` (Web Application)
     - `s3-static-website` (Security & CDN)
     - `langfuse-on-aws` (Observability)
     - `multi-tenant-saas` (SaaS)
     - `vpc-lattice-service-communication` / `transitgateway-secure-hubspoke` (Networking) ★新規
     - `account-factory` (Governance)

> **SVGエクスポート注意**: `drawio` CLI で SVG 出力する際、`--embed-diagram` オプションを付けるとプロセスがハングする事象が確認されています。このオプションは**除外**して使用すること。
> ```bash
> drawio --export --format svg --svg-theme light --border 10 \
>   --output "aws-patterns/img/<name>.drawio.svg" \
>   "aws-patterns/draw.io/<name>.drawio"
> ```

#### 日本語検索パイプライン

1. `scripts/copy-kuromoji-dict.js` — ビルド/起動時に `node_modules/kuromoji/dict` から `public/kuromoji/dict/` に辞書バイナリファイルをコピー（コピー先にファイルが既に存在する場合は自動でスキップされる）
2. `src/lib/kuromoji-tokenizer.ts` — `kuromoji` を用いて、日本語テキストを単語（トークン）のスペース区切り形式に分解するシングルトン・トークナイザー（※クライアントサイドでの辞書ロード負荷削減のため、ブラウザ上では簡易トークナイズにフォールバックし、Kuromojiのロードはサーバーサイド/ビルド時のみ実行するように最適化されています）
3. `src/components/SearchBox.tsx` — クライアントサイドで記事データ（タイトル、本文、タグ、カテゴリ等）をトークナイズし、`Fuse.js` を用いて全文検索を実行

#### 静的OGP画像生成パイプライン

1. `scripts/download-fonts.js` — ビルド/起動時に OGP 画像で使用する日本語フォント（`NotoSansCJKjp-Bold.otf`）およびアバター画像（`avatar.png`）を自動ダウンロードする（失敗した場合は空のダミーファイルを置く、または外部URLへフォールバックしてビルドエラーを防ぐ）
2. `app/og/[slug]/image.png/route.tsx` — Next.js 16 の `ImageResponse` と `generateStaticParams()` を用いて、SSG（`output: 'export'`）環境でもビルド時に全ブログ記事の OGP 画像を静的 PNG ファイルとして事前生成・出力する（ローカルの `avatar.png` を優先し、なければ外部URLへフェイルセーフする）

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
| `app/tools/`      | オンライン便利ツール（`/tools`）および各ツールの個別ページルート（全53種） |
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
- サイト全体で **15種類の多彩なデザインテーマ（デフォルトはNeo-Brutalism）** を採用したフレキシブルなスタイリングシステムを導入：
  - 各テーマ（Neo-Brutalism, Glassmorphism, Minimal, Bento, Blueprint, Steampunk, Chalkboard など15種類）は `app/globals.css` で CSS 変数として定義され、`data-theme` 属性で切り替わります。
  - 共通のUIパーツ（カード、ボタン、入力エリア）には、選択されたテーマに応じた専用のスタイル（ボーダー、シャドウ、エフェクト）が自動適用されます。
  - 見出し等のタイポグラフィには Google Fonts からインポートした **Lexend** と **Space Grotesk** を優先して割り当てる設計です。新テーマ用に **Caveat**（Chalkboard）・**Cinzel**（Steampunk）・**Outfit**（Holographic）・**Roboto Mono**（Blueprint）も追加インポート済み。
  - 新しいコンポーネントの実装やテーマ別のスタイリング調整を行う際は、`.agents/designs/DESIGN_*.md` の各テーマ詳細仕様書を参照してください。

## テーマ・エフェクト開発ガイドライン

デザインテーマの修正、新規テーマの追加、または共通エフェクト（`ThemeEffectManager.tsx`など）を編集する際は、デグレードとビルドエラーを防ぐために以下の開発ルールを厳格に遵守すること。

### 1. 厳密な型定義と `any` の禁止
- コード内に `any` 型や `as any` キャストを記述してはならない（`@typescript-eslint/no-explicit-any` ルールによりビルドがブロックされる）。
- イベントオブジェクトやDOM参照、外部ライブラリの返り値には、必ず適正な型（例: `EventListener`, `React.MouseEvent`, `unknown`）を割り当て、必要に応じて型ガードまたは非 null アサーション（`!`）を適切に活用すること。

### 2. ライト＆ダーク両モードの表示検証
- テーマ固有の背景、Blob（グラデーション）、テキスト、およびボタン等の配色を変更した際は、必ず**ライトモードとダークモードの両方の表示状態**をチェックし、背景色や要素がデグレードしていないか、文字が十分に読み取れるコントラストが確保されているか確認すること。
- 背景グラデーションを上書きする際は、テーマの基本背景色が無視されないよう、`isDark` の状態を用いて動的に配色を切り替えるか、または `bg-transparent` を設定してCSS側の `body` 背景が透けるようにすること。

### 3. セレクタのスコープ制限と既存レイアウトの干渉防止
- テーマ別のCSSを追加・修正する際は、必ずテーマ指定の属性（例: `[data-theme='theme-name']`）で囲み、他テーマの要素を汚染しないようにすること。
- カード（`.theme-card`）などに外側の寸法線や枠外アノテーションなどを置く場合、既存の `overflow: hidden` レイアウトなどと干渉して要素が切り取られないか検証し、必要に応じて該当テーマのみ `overflow: visible !important;` を上書き指定すること。

### 4. コミット前の検証ビルド実行
- 変更完了時、コミットする前に必ずローカルで以下のコマンドを手動実行し、警告やエラーが出ないことを確認すること。
  ```bash
  bun run lint         # ESLint / Prettier の検証（自動修正は --fix）
  bun run type-check   # TypeScript の型チェック
  bun run build        # 最適化ビルドと全ページ（300以上）のSSGエクスポート検証
  ```

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
