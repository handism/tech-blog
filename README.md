# Handism's Tech Blog

Next.js の SSG で構築し、GitHub Pages（`https://handism.github.io/tech-blog/`）で配信している技術ブログです。

## 主な機能

- **ブログ記事**（`md/`）：Markdown で執筆。カテゴリ・タグ・全文検索・RSS・Sitemap・OGP 画像の自動生成に対応
- **Scraps**（`/scraps`）：日々の気づきやエラー解決ログを短く残す技術メモ
- **学習ガイド**（`/learning`）：Docker・TypeScript・AWS など 17 コースをロードマップ形式で学べる。Mermaid 図解・読了進捗管理・理解度クイズ付き
- **AWS Patterns**（`/patterns`）：CloudFormation テンプレートと Draw.io 構成図 22 種のギャラリー。コードプレビュー・ダウンロード・デプロイコマンド生成付き
- **Tools**（`/tools`）：ブラウザ完結型の開発者向けツール 19 種（画像・SVG・JSON/YAML 変換・暗号/ID 生成・テキスト・CSS・Git・色・QR コードなど）
- **15 種類のデザインテーマ**：OLED（デフォルト）、Neo-Brutalism、Glassmorphism、Terminal、Synthwave、Modern Japanese などをリアルタイムに切り替え可能

## 技術スタック

| 用途 | 採用技術 |
| ---- | -------- |
| フレームワーク | Next.js 16（SSG） + React 19 + TypeScript |
| スタイリング | Tailwind CSS 4 + Tailwind Typography |
| Markdown | unified（remark / rehype）+ Shiki + Mermaid.js |
| 検索 | 簡易分かち書き + Fuse.js（クライアント側全文検索） |
| バリデーション | Zod（フロントマター） |
| テスト | Vitest（ユニット）・Playwright（全テーマの VRT） |
| ホスティング | GitHub Pages + GitHub Actions |

## 開発

パッケージマネージャは [bun](https://bun.sh/) です。

```bash
bun install          # 依存関係と Git フックのインストール
bun run dev          # 開発サーバー → http://localhost:3000/tech-blog/
bun run build        # SSG ビルド（out/ に出力）
bun run start        # out/ を basePath 配下で配信
bun run analyze      # バンドルサイズ分析
```

サイトは `basePath`（`src/config/site.ts`、既定値 `/tech-blog`）配下で配信されます。`dev` / `build` の前処理でフォント取得（`scripts/download-fonts.js`）とパターン素材の `public/patterns/` への同期（`scripts/copy-pattern-assets.js`）が自動実行されます。

### テスト・品質チェック

```bash
bun run lint                               # ESLint / Prettier
bun run type-check                         # TypeScript 型チェック
bun run test:unit                          # Vitest
bunx vitest run tests/post-parser.test.ts  # 単一ファイルのみ実行
bun run test:vrt                           # Playwright VRT（事前に bun run build が必要）
bun run test:vrt:update                    # VRT スナップショット更新
```

コミット時は `simple-git-hooks` + `lint-staged` により、ステージ済みファイルへの `eslint --fix` と全体の型チェックが自動実行されます。

### デプロイ

`main` ブランチへのプッシュで GitHub Actions（`.github/workflows/deploy.yml`）が `out/` を GitHub Pages にデプロイします。

## コンテンツの追加

フロントマターの仕様は Zod スキーマが正です（ブログ：`src/lib/post-parser.ts`、Scraps：`src/lib/scrap-parser.ts`、学習ガイド：`src/lib/learning-parser.ts`）。

### ブログ記事

`md/<slug>.md`（kebab-case）に配置します。ひな形は `md/template/posts.md`。画像は `public/images/` に置きます（サムネイルは 16:9 推奨）。

```yaml
---
title: 記事タイトル   # 省略時: "No title"
date: YYYY-MM-DD
tags: [tag1, tag2]
category: カテゴリ名  # 省略時: "uncategorized"
image: filename.webp  # public/images/ 以下。省略時は動的 OGP 画像
draft: true           # 本番ビルドから除外
---
```

- 見出しは H2 から始める（H1 は記事タイトル）
- `md/draft/` などサブディレクトリ内のファイルはビルド対象外
- コードブロックは ` ```ts:utils.ts ` のように `:ファイル名` でファイル名を表示できる。` ```mermaid ` で Mermaid 図を描画できる

#### AI による画像生成

`.env.local` に `GEMINI_API_KEY` を設定すると、Google GenAI で記事用の画像を生成し、記事へ自動設定できます。

```bash
bun run gen-thumb <slug>     # フラットポップ調サムネイル（文字は sharp で合成）
bun run gen-thumb-ai <slug>  # 文言込みで AI が描く YouTube サムネイル風イラスト
bun run gen-info <slug>      # 本文を解析し、最適な位置に図解インフォグラフィックを挿入
```

### Scraps

`scraps/<slug>.md` に配置します。フロントマターはブログ記事から `category` と `image` を除いたものです。

### 学習ガイド

`learning/<course-id>/` にコース設定の `meta.json` とチャプターの Markdown を配置します。

```json
{
  "title": "コースのタイトル",
  "description": "コースの説明文",
  "icon": "container",
  "category": "infra"
}
```

`icon` は `src/config/learning-icons.ts` に登録された Lucide アイコン名です（未登録なら `book`）。チャプターのフロントマターでは `order`（並び順。省略時は 1）と任意の `quiz`（`question` / `options` / `correctIndex` / `explanation`）を指定します。

### AWS Patterns

1. `patterns/gallery-meta.json` にパターン定義（`slug`・`title`・`description`・`category`・`templateFile`・`diagramFile`・`awsServices`）を追加
2. `patterns/iac/` に CloudFormation テンプレート（`.yaml`）を配置
3. `patterns/img/` に構成図（`.drawio.svg`）を配置（図がなければ `diagramFile: null`）。図の原本は `patterns/draw.io/`、エクスポート手順は `patterns/CLAUDE.md` を参照

## 設定

`src/config/` に関心事ごとの設定があります。

- `site.ts`：サイト名・URL・basePath・著者・ページネーションなど
- `themes.ts`：デザインテーマ一覧とデフォルトテーマ
- `layout.ts`：記事一覧のレイアウト（列数）
- `tools.ts`：Tools メニュー項目
- `storage-keys.ts`：localStorage キー一覧（設定画面のバックアップ・リセット対象はここから自動生成）

## AI エージェント向けドキュメント

開発ルールやアーキテクチャ上の注意点は `AGENTS.md`（`CLAUDE.md` はそのシンボリックリンク）にまとめています。新機能・ルーティング・テスト・アーキテクチャの変更時は `README.md` と `AGENTS.md` を同時に更新してください。
