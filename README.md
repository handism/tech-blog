# ブログサイト向けVitePressテーマ「hekireki」

## 特徴

* シンプルかつ軽快に動作する`VitePressカスタムテーマ`
* 記事のデータソースは`Markdownファイル`に対応
* OS設定に基づいた自動ダークモードに対応
* レスポンシブレイアウトに対応
* URLは`/[mdファイル名]`の形式、タグページは`/tag/[タグ名]`の形式


## 使い方

### 導入

* 本リポジトリは`GitHub`の`テンプレートリポジトリ`となっているため、以下Webサイトを参考にしてリポジトリを作成してください
  * https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
* ホスティングについては、必要に応じて`GitHub Pages`などの設定を行ってください


### サイト設定

* 設定ファイルは`.vitepress/config.mjs`
* サイトごとに必要な設定を変更してください


### CSS設定

* グローバルのCSSは`.vitepress/theme/style.css`にまとめています
* 必要に応じて設定を変更・追加してください


### 記事・固定ページ設定

* mdファイルは`src`フォルダ内に入れていってください
* `src/template`内にmdファイルのテンプレートが格納されているので、コピーして使用してください
  * `posts.md`：記事のテンプレート
  * `pages.md`：固定ページのテンプレート
* 下書きは`src/draft`フォルダ内に入れればサイトに反映されません
* 画像は`src/publuc`フォルダ内に入れてください
  * サムネイル画像は`16:9`がおすすめ
* `Frontmatter`は以下に対応しています
  * title（タイトル）：Webページ上のタイトル、記事のH1タグに反映
  * date（作成日）：`YYYY-MM-DD`形式、記事のヘッダ部に反映
  * tags（タグ）：配列形式、アルファベット・単一の半角スペース・ハイフンのみ使用可
    * tagsが存在しない場合は固定ページとして扱われます
  * image（サムネイル画像）：`sample.jpg`みたいにファイル名を指定
* H1タグは記事タイトルになるので、見出しはH2から始めてください


### Markdown

* Frontmatter：`---`
* 見出し：`#`、`##`、`###`、`####`
* 改行：`半角スペース2つ`
* 段落：`空行`
* 箇条書き：`*`、`-`
* 画像表示：`![画像](sample.jpg)`
* 強調：`**強調**`
* 絵文字表示：`:tada: :100:`
* 区切り線：`***`、`---`
* コード：

```
`コード`
```

* コードブロック：pre,code

````
```
コードブロック
```
````

* カスタムブロック

```
::: tip
TIPSをここに記入
:::
```

* 表

```
| ブログサービス | CMS | SSG |
| --- | --- | --- |
| はてなブログ | WordPress | Gatsby |
| Blogger | Jimdo | Hugo |
| Qiita | Movable Type | Jskyll |
```
