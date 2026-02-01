# Handism's Tech Blog

## このブログについて

- 現役の内製クラウドインフラエンジニアによる技術ブログです。日々の業務やプライベートで得た知識の備忘録として運用中
- SSG（静的サイト生成） × SPA（シングルページアプリケーション）に対応しているので軽快に動作するはず
- ダークモードにも対応しており、OSの設定でダークモードをONにしている場合は自動的に背景が暗くなる
- サムネイル画像にも対応。比率は16:9がおすすめ

## 技術スタック

- **フロントエンド**: Next.js 16 + React 19
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **マークダウン処理**: Remark（HTML変換、見出し自動リンク、スラッグ生成対応）
- **テーマ切り替え**: next-themes（ダークモード対応）
- **検索機能**: Fuse.js（クライアント側全文検索）
- **ホスティング**: GitHub Pages
- **デプロイ**: GitHub Actions（`main`ブランチへのプッシュで自動デプロイ）

## 使い方

### 導入

- 本リポジトリは`GitHub`の`テンプレートリポジトリ`となっているため、以下Webサイトを参考にしてリポジトリを作成してください
  - https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
- ホスティングについては、必要に応じて`GitHub Pages`などの設定を行ってください
  - `GitHub Actions`による自動デプロイには`.github/workflows/static.yml`を使用できます

### 開発方法

ローカルで動作確認する場合は以下コマンドで。終了するならCtrl + C。

```bash
npm run dev
```

### ビルド

本番ビルドを実行する場合は以下。

```bash
npm run build
npm start
```

SSG出力は `out/` ディレクトリに生成されます。

### コンテンツの追加

ブログ記事は `md/` ディレクトリにMarkdownファイルとして配置します。  
ファイル名の命名規則：`kebab-case.md`

### デプロイメント

`main`ブランチへのプッシュにより、GitHub Actions ワークフローが自動実行され、`out/` ディレクトリがGitHub Pagesへデプロイされます。

### サイト設定

- 設定ファイルは`.vitepress/config.mjs`
- サイトごとに必要な設定を変更してください

### CSS設定

- グローバルのCSSは`.vitepress/theme/style.css`にまとめています
- 必要に応じて設定を変更・追加してください

### 記事・固定ページ設定

- mdファイルは`src`フォルダ内に入れていってください
- `src/template`内にmdファイルのテンプレートが格納されているので、コピーして使用してください
  - `posts.md`：記事のテンプレート
  - `pages.md`：固定ページのテンプレート
- 下書きは`src/draft`フォルダ内に入れればサイトに反映されません
- 画像は`src/publuc`フォルダ内に入れてください
  - サムネイル画像は`16:9`がおすすめ
- `Frontmatter`は以下に対応しています
  - `title（タイトル）`：Webページ上のタイトル、記事のH1タグに反映
  - `date（作成日）`：`YYYY-MM-DD`形式、記事のヘッダ部に反映
  - `tags（タグ）`：配列形式、アルファベット・単一の半角スペース・ハイフンのみ使用可
    - tagsが存在しない場合は固定ページとして扱われます
  - `category（カテゴリー）`: 記事のカテゴリー、アルファベット・単一の半角スペース・ハイフンのみ使用可
  - `image（サムネイル画像）`：`sample.jpg`みたいにファイル名を指定
- H1タグは記事タイトルになるので、見出しはH2から始めてください

### Markdown

- 見出し：`#`、`##`、`###`、`####`
- 改行：`半角スペース2つ`
- 段落：`空行`
- 箇条書き：`*`、`-`
- 画像表示：`![トップ画像](./public/site-image.webp)`
- リンク：`[リンク文言](https://github.com/handism/hekireki)`
- 強調：`**強調**`
- 絵文字表示：`:tada: :100:`
- 区切り線：`***`、`---`
- コード：

```
`コード`
```

- コードブロック：pre,code

````
```
コードブロック
```
````

- 引用

```
> 引用
> ウィキペディアは誰でも編集できるフリー百科事典です
```

- 表

```
| ブログサービス | CMS | SSG |
| --- | --- | --- |
| はてなブログ | WordPress | Gatsby |
| Blogger | Jimdo | Hugo |
| Qiita | Movable Type | Jskyll |
```
