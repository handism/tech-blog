# AGENTS.md

このファイルは、リポジトリ内のコードを扱う際に Antigravity へ提供するガイダンスです。

## コマンド

```bash
bun run dev              # 開発サーバー起動（前処理で scripts/download-fonts.js と scripts/copy-pattern-assets.js を実行）
bun run build            # 本番ビルド（前処理で scripts/download-fonts.js と scripts/copy-pattern-assets.js を実行し静的ファイルを /out に出力）
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

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。`main` へのプッシュで GitHub Actions（`.github/workflows/deploy.yml`）が自動デプロイ。CI（`.github/workflows/ci.yml`）では lint とユニットテストを実行。

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

コースの一覧は `learning/` 直下のディレクトリが正（コース ID ＝ディレクトリ名）。

#### AWS Patterns（`patterns/`）

1. `patterns/gallery-meta.json` — 全パターンのメタデータを一括管理（`src/types/aws-gallery.ts` の Zod スキーマでバリデーション）。パターンの一覧はこのファイルが正
2. `src/lib/aws-gallery-repository.ts` — メタデータと `patterns/iac/*.yaml` テンプレートを読み込み、アセット（YAML・`patterns/img/*.drawio.svg`）を更新日時比較で `public/patterns/` に自動コピー
3. `src/lib/aws-gallery-server.ts` — React `cache()` で集約し、YAML を Shiki でハイライト済み HTML に事前生成
4. `app/patterns/` — `/patterns`（一覧）・`/patterns/[slug]`（詳細）の 2 ルート

> **SVG エクスポート注意**: `drawio` CLI で SVG 出力する際、`--embed-diagram` オプションを付けるとプロセスがハングする事象が確認されています。このオプションは**除外**して使用すること。
> ```bash
> drawio --export --format svg --svg-theme light --border 10 \
>   --output "patterns/img/<name>.drawio.svg" \
>   "patterns/draw.io/<name>.drawio"
> ```

#### 日本語検索パイプライン

1. `src/lib/text-tokenizer.ts` — 文字種（漢字・ひらがな・カタカナ・英数字）ベースの軽量な簡易分かち書き。検索精度の一貫性のため、ビルド時（サーバー）とクライアントで同一ロジックを使用（kuromoji 本体には依存していない）
2. `app/search.json/` — ビルド時に全記事の検索インデックスを生成
3. `src/components/SearchBox.tsx` — クライアントサイドで `Fuse.js` を用いて全文検索を実行

#### 静的 OGP 画像生成パイプライン

1. `scripts/download-fonts.js` — ビルド/起動時に OGP 画像で使用する日本語フォント（`NotoSansCJKjp-Bold.otf`）とアバター画像（`avatar.png`）を自動ダウンロード（失敗時は空のダミーファイル設置または外部 URL へフォールバックしてビルドエラーを防ぐ）
2. `app/og/[slug]/image.png/route.tsx` — `ImageResponse` + `generateStaticParams()` により、SSG（`output: 'export'`）環境でもビルド時に全ブログ記事の OGP 画像を静的 PNG として事前生成

### 主要ディレクトリ

| パス               | 役割                                                             |
| ------------------ | ---------------------------------------------------------------- |
| `.agents/`         | エージェント用ガイダンス（rules, designs, workflows, skills 等） |
| `.agents/designs/` | デザインテーマごとの詳細設計書（`DESIGN_*.md`）                  |
| `md/`              | ブログ記事（`draft/` は下書き・ビルド対象外。`template/` にひな形あり） |
| `scraps/`          | Scraps 記事（短い技術メモ・備忘録）                              |
| `learning/`        | 学習ガイド（コースごとのフォルダ＋`meta.json`＋章別 `.md`）      |
| `patterns/`        | AWS Patterns（`gallery-meta.json`・`iac/*.yaml`・`img/*.drawio.svg`・`draw.io/` 原本） |
| `src/lib/`         | ビジネスロジック（パース・レンダリング・検索・ページネーション） |
| `src/components/`  | UI コンポーネント（サーバー・クライアント。ツール類は `tools/`、テーマ演出は `theme-effects/`） |
| `src/hooks/`       | カスタムフック（クリップボード・学習進捗・TOC 監視など）        |
| `src/config/`      | 設定値。`site.ts`（著者・ページネーション等）／`themes.ts`（テーマカタログと `DEFAULT_THEME`）／`layout.ts`（一覧レイアウト）／`tools.ts`（ツールメニュー項目）に関心事ごとに分割 |
| `src/types/`       | TypeScript インターフェース（`post.ts`・`scrap.ts`・`learning.ts`・`aws-gallery.ts`） |
| `public/images/`   | 記事カバー画像（16:9 比率、`.webp` 推奨）                        |
| `app/tools/`       | ブラウザ完結型ツール群のルート                                   |
| `tests/`           | テストファイル（ユニット: `*.test.ts`、VRT: `vrt.test.ts` + スナップショット） |

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
- スタイリングは Tailwind CSS 4、本文組版は Tailwind Typography
- サイト全体で複数のデザインテーマを採用したフレキシブルなスタイリングシステムを導入：
  - テーマカタログとデフォルトテーマは `src/config/themes.ts`（`themeConfig` / `DEFAULT_THEME`）が正
  - 各テーマは `app/globals.css` で CSS 変数として定義され、`data-theme` 属性で切り替わる
  - 共通の UI パーツ（カード、ボタン、入力エリア）には、選択されたテーマに応じた専用スタイル（ボーダー、シャドウ、エフェクト）が自動適用される
  - 新しいコンポーネントの実装やテーマ別のスタイリング調整を行う際は、`.agents/designs/DESIGN_*.md` の各テーマ詳細仕様書を参照すること

## テーマ・エフェクト開発ガイドライン

デザインテーマの修正、新規テーマの追加、または共通エフェクト（`ThemeEffectManager.tsx` と `src/components/theme-effects/` 配下）を編集する際は、デグレードとビルドエラーを防ぐために以下の開発ルールを厳格に遵守すること。

### 1. 厳密な型定義と `any` の禁止
- コード内に `any` 型や `as any` キャストを記述してはならない（`@typescript-eslint/no-explicit-any` ルールによりビルドがブロックされる）。
- イベントオブジェクトや DOM 参照、外部ライブラリの返り値には、必ず適正な型（例: `EventListener`, `React.MouseEvent`, `unknown`）を割り当て、必要に応じて型ガードまたは非 null アサーション（`!`）を適切に活用すること。

### 2. ライト＆ダーク両モードの表示検証
- テーマ固有の背景、Blob（グラデーション）、テキスト、およびボタン等の配色を変更した際は、必ず**ライトモードとダークモードの両方の表示状態**をチェックし、背景色や要素がデグレードしていないか、文字が十分に読み取れるコントラストが確保されているか確認すること。
- 背景グラデーションを上書きする際は、テーマの基本背景色が無視されないよう、`isDark` の状態を用いて動的に配色を切り替えるか、または `bg-transparent` を設定して CSS 側の `body` 背景が透けるようにすること。

### 3. セレクタのスコープ制限と既存レイアウトの干渉防止
- テーマ別の CSS を追加・修正する際は、必ずテーマ指定の属性（例: `[data-theme='theme-name']`）で囲み、他テーマの要素を汚染しないようにすること。
- カード（`.theme-card`）などに外側の寸法線や枠外アノテーションなどを置く場合、既存の `overflow: hidden` レイアウトなどと干渉して要素が切り取られないか検証し、必要に応じて該当テーマのみ `overflow: visible !important;` を上書き指定すること。

### 4. コミット前の検証ビルド実行
- 変更完了時、コミットする前に必ずローカルで以下のコマンドを手動実行し、警告やエラーが出ないことを確認すること。
  ```bash
  bun run lint         # ESLint / Prettier の検証（自動修正は --fix）
  bun run type-check   # TypeScript の型チェック
  bun run build        # 最適化ビルドと全ページのSSGエクスポート検証
  ```

## 品質保証 (Git Hooks)

CI の破壊を防ぐため、`simple-git-hooks` と `lint-staged` によるコミット前チェックが導入されています。

- **プレコミット時自動チェック**:
  - コミットしようとした（ステージングされた）`.ts`, `.tsx`, `.js`, `.jsx` ファイルに対して自動的に `eslint --fix` が走り、コードスタイル（Prettier 含む）が修正されます。
  - プロジェクト全体に対して `bun run type-check`（`tsc --noEmit`）が実行され、型エラーがある場合はコミットがブロックされます。
- **フックの有効化**:
  - パッケージインストール時（`bun install`）に `prepare` スクリプトによって自動的にフックがセットアップされます。
  - 手動で再セットアップする場合は `bunx simple-git-hooks` を実行してください。

## ドキュメント管理ルール

**`AGENTS.md` と `README.md` は常に最新の状態を保つこと。**（なお `CLAUDE.md` は `AGENTS.md` へのシンボリックリンクです。）新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
