# AGENTS.md

このファイルは、リポジトリ内のコードを扱う際に Antigravity へ提供するガイダンスです。

## コマンド

各コマンドは `package.json` の `scripts` を参照（パッケージマネージャは bun）。以下のみ非自明：

- VRT は `out/` を `serve` で配信して実行するため、**先に `bun run build` を済ませておくこと**（対象: `tests/vrt.test.ts`、Vitest からは除外済み）。
- 単一テストファイルの実行は `bunx vitest run tests/post-parser.test.ts` のように指定する。
- AI 画像生成コマンド:
  - `bun run gen-thumb <slug>` : 記事（`md/<slug>.md`）のフラットポップ調サムネイル画像を生成・保存しフロントマターを自動更新（`scripts/generate-thumbnail.ts`）。
  - `bun run gen-info <slug>` （または `bun run gen-infographic <slug>`） : 記事本文を解析して最適な図解挿入位置を特定し、シンプルでクリーンな技術ドキュメント風インフォグラフィック図を生成・保存した上で Markdown 本文に自動設定・更新する（`scripts/generate-infographic.ts`）。

## アーキテクチャ

Next.js 16 の App Router と SSG（`output: 'export'`）を使用した GitHub Pages 向け静的ブログ。`main` へのプッシュで GitHub Actions（`.github/workflows/deploy.yml`）が自動デプロイ。CI（`.github/workflows/ci.yml`）では lint とユニットテストを実行。

### コンテンツパイプライン

コンテンツタイプは **ブログ記事**（`md/`）・**Scraps**（`scraps/`）・**学習ガイド**（`learning/`）・**AWS Patterns**（`patterns/`）の 4 種類。それぞれ独立したパイプラインを持つが、下位層を共有する。

各パイプラインは `src/lib/<type>-repository.ts`（読み込み）→ `<type>-parser.ts`（Zod バリデーション）→ `post-renderer.ts`（Markdown → HTML、コンテンツ非依存で全タイプ共用）→ `<type>-server.ts`（React `cache()` で集約）→ `app/<type>/`（`generateStaticParams()` で SSG）という層構成。詳細は各ファイルを参照。

以下は**コードを読んでも分からない**前提・制約：

- コースの一覧は `learning/` 直下のディレクトリが正（コース ID ＝ディレクトリ名）。
- パターンの一覧は `patterns/gallery-meta.json` が正。
- `src/lib/text-tokenizer.ts` の簡易分かち書きは、**検索精度の一貫性のためビルド時（サーバー）とクライアントで同一ロジックを使用する**こと（kuromoji 本体には依存していない）。
- `scripts/download-fonts.js` は OGP 用フォント・アバターの取得に失敗しても、空のダミーファイル設置または外部 URL へのフォールバックでビルドを止めない設計。この挙動を壊さないこと。
- Mermaid コードブロックは Shiki をバイパスして生の HTML `div` になり、クライアント側の `MermaidRenderer` が SVG 描画する。この際 `post-renderer.ts` の `escapeMermaidSource()` で `& < >` をエスケープすること（ラベル内の `<br/>` などがブラウザに HTML として解釈されると `textContent` 読み戻し時に構文が壊れる）。
- 図（`patterns/img/*.drawio.svg`）のエクスポート手順とハマりどころは `patterns/CLAUDE.md` を参照。

### フロントマターの形式

フロントマターの仕様は **Zod スキーマが正**：`src/lib/post-parser.ts`（ブログ記事）／`src/lib/scrap-parser.ts`（Scraps）／`src/lib/learning-parser.ts`（学習ガイド。コースフォルダ直下の `meta.json` 含む）。型定義は `src/types/` 配下。

- ブログ記事のみ、省略・不正な値は `siteConfig.posts.defaultTitle` / `defaultCategory` にフォールバックする。
- `draft: true` の記事は本番ビルドから除外される。
- 学習ガイドの `meta.json` の `icon` は Lucide アイコン名（`src/config/learning-icons.ts` の登録キー）。JSON からコンポーネントを直接持てないための間接参照で、未登録なら `book` にフォールバックする。

### 主要ディレクトリ

ディレクトリ構成は `ls` で確認できる。以下 2 点のみ非自明：

- `md/draft/` は下書きでビルド対象外（`md/template/` にひな形あり）。
- `patterns/draw.io/` が図の原本。`patterns/img/*.drawio.svg` はそこからのエクスポート結果であり、直接編集しない。

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
| `DashboardShell` / `DashboardHero` / `DashboardFilterBar` / `DashboardSection*` | `src/components/dashboard/` | Tools・学習ガイド・Scraps の一覧ページ共通レイアウト（外枠幅、ヒーローヘッダー、検索＋フィルタタブ、カテゴリ見出し、0 件表示）。一覧系ページを増やす際はここを使い、3 ページ間で見た目がずれないようにする |
| `LearningCourseIcon` | `src/components/LearningCourseIcon.tsx` | `meta.json` の `icon` 名を Lucide アイコンとして描画する。`resolveLearningIcon()` を呼び出し側で変数に束ねると `react-hooks/static-components` に抵触するため、必ずこのコンポーネント経由で使う |
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
- アイコンは絵文字ではなく `lucide-react` の SVG アイコンを使う。`<option>` 内など SVG を置けない箇所ではアイコンを省き、テキストのみにする

## テーマ・エフェクト開発ガイドライン

デザインテーマの修正、新規テーマの追加、共通エフェクト（`ThemeEffectManager.tsx` と `src/components/theme-effects/` 配下）の編集を行う際の詳細ルールは `.agents/rules/theme-effects.md` にある。作業前に必ず参照すること（Claude Code では `theme-effects` スキル経由で自動的に読み込まれる）。

**変更完了時、コミットする前に必ずローカルで以下を手動実行し、警告やエラーが出ないことを確認すること。**

```bash
bun run lint         # ESLint / Prettier の検証（自動修正は --fix）
bun run type-check   # TypeScript の型チェック
bun run build        # 最適化ビルドと全ページの SSG エクスポート検証
```

## ドキュメント管理ルール

**`AGENTS.md` と `README.md` は常に最新の状態を保つこと。**（なお `CLAUDE.md` は `AGENTS.md` へのシンボリックリンクです。）新機能・ルーティング・テスト・アーキテクチャ・コードスタイルの変更時は両ファイルを同時に更新する。
