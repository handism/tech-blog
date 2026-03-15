# Handism's Tech Blog

## このブログについて

- 現役の内製クラウドインフラエンジニアによる技術ブログです。日々の業務やプライベートで得た知識の備忘録として運用中
- SSG（静的サイト生成）に対応しているので軽快に動作するはず
- ダークモードにも対応しており、OS の設定でダークモードを ON にしている場合は自動的に背景が暗くなる
- サムネイル画像にも対応。比率は 16:9 がおすすめ
- サイドバーありの 2 カラムレイアウトで、レスポンシブレイアウトに対応
- 記事のデータソースは `Markdown ファイル` に対応

## 技術スタック

- **フロントエンド**：Next.js 16 + React 19
- **言語**：TypeScript
- **スタイリング**：Tailwind CSS 4
- **マークダウン処理**：Remark + rehype（HTML 変換・見出し自動リンク・スラッグ生成・TOC 生成）
- **シンタックスハイライト**：Shiki（github-dark テーマ）
- **テーマ切り替え**：next-themes（ダークモード対応）
- **検索機能**：Fuse.js（クライアント側全文検索）
- **バリデーション**：Zod（frontmatter）
- **ホスティング**：GitHub Pages
- **デプロイ**：GitHub Actions（`main` ブランチへのプッシュで自動デプロイ）
- **E2E テスト**：Playwright
- **ユニットテスト**：Vitest

## 使い方

### 導入

- 本リポジトリをクローンすればすぐに導入可能
- ホスティングについては、必要に応じて `GitHub Pages` などの設定を行ってください
  - `GitHub Actions` による自動デプロイには `.github/workflows/static.yml` を使用できます

### 開発方法

ローカルで動作確認する場合は以下コマンドで。終了するなら Ctrl + C。

```bash
npm run dev
```

### ビルド

本番ビルドを実行する場合は以下。

```bash
npm run build
npm start
```

SSG 出力は `out` ディレクトリに生成されます。

### バンドルサイズ分析

```bash
npm run analyze
```

ブラウザでクライアント・サーバー・エッジのバンドルサイズを可視化するレポートが生成されます。

### テスト

E2E テスト（Playwright）：

```bash
npm run test:e2e      # テスト実行（deployed site 対象）
npm run test:e2e:ui   # インタラクティブ UI モードで実行
```

ユニットテスト（Vitest）：

```bash
npm run test:unit
```

テストファイルは `tests/` ディレクトリ以下に配置します。
- `*.spec.ts` → Playwright E2E テスト
- `*.test.ts` → Vitest ユニットテスト

### コンテンツの追加

ブログ記事は `md` ディレクトリに Markdown ファイルとして配置します。
ファイル名の命名規則：`kebab-case.md`

### デプロイメント

`main` ブランチへのプッシュにより、GitHub Actions ワークフローが自動実行され、`out` ディレクトリが GitHub Pages へデプロイされます。

### サイト設定

- 設定ファイルは `src/config/site.ts`
- サイトごとに必要な設定（サイト名・URL・著者名など）を変更してください

### CSS 設定

- グローバルの CSS は `app/globals.css` にまとめています
- `:focus-visible` スタイルはアクセント色（emerald）で定義済みです

### 記事ページ設定

- md ファイルは `md` ディレクトリ内に入れてください
- `md/template` 内に md ファイルのテンプレートが格納されているので、コピーして使用してください
- 下書きは `md/draft` ディレクトリ内に入れればサイトに反映されません
- 画像は `public/images` ディレクトリ内に入れてください
  - サムネイル画像はアスペクト比 `16:9` がおすすめ

### Frontmatter

各フィールドは Zod によりバリデーションされます。省略・不正な値はデフォルト値にフォールバックします。

```yaml
---
title: 記事タイトル          # 省略時: "No title"
date: YYYY-MM-DD             # 省略可
tags: [tag1, tag2]           # 省略時: []
category: カテゴリ名          # 省略時: "uncategorized"
image: filename.webp         # public/images/ 以下のファイル名（省略可）
---
```

H1 タグは記事タイトルになるので、見出しは H2 から始めてください。

### Markdown

- **見出し**：`##`、`###`、`####`
- **改行**：`半角スペース 2 つ`
- **段落**：`空行`
- **箇条書き**：`*`、`-`
- **画像表示**：`![画像](/images/image.png)`
- **リンク**：`[リンク文言](https://github.com/handism/)`
- **強調**：`**強調**`
- **区切り線**：`***`、`---`
- **コード**：`` `コード` ``
- **コードブロック**：

````
```言語名
コードブロック
```
````

- **引用**：

```
> 引用テキスト
```

- **表**：

```
| ヘッダー1 | ヘッダー2 |
| --------- | --------- |
| セル1     | セル2     |
```

## SEO・アクセシビリティ

- OGP / Twitter Card をサイト全体および記事ページで設定
- 記事ページに JSON-LD（`BlogPosting` スキーマ）を埋め込み
- Sitemap に記事・カテゴリ・タグページと `lastmod` を出力
- キーボードナビゲーション対応（ドロップダウンメニュー・フォーカスリング）
- `ThemeToggle` に `aria-label` を設定
