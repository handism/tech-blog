# ブログサイト向けVitePressテーマ「Simpla」

## 特徴

* シンプルかつ軽快に動作するVitePressテーマ
* TypeScriptは使用せず、JavaScriptで作成
* 極力外部モジュールを使用しない
* ブログ運営に手間をかけさせない
* URLは`/[mdファイル名]`の形式、タグページは`/tag/[タグ名]`の形式
* OS設定に基づいたダークモード、レスポンシブレイアウトに対応済み
* Windows 11、iPhone、Androidでの動作確認済み


## 仕様

### 記事更新

* mdファイルは`src`フォルダ内に入れていく
* Frontmatterは以下に対応
  * title（タイトル）：任意
  * tags（タグ）：任意、配列形式で
  * image（サムネイル画像）：任意（「sample.jpg」みたいにファイル名を指定）
* h1タグは記事タイトルになるので、見出しはh2から始める
* 画像は`src/publuc`フォルダ内に入れていく
* mdファイルの拡張子の末尾に`_`などをつけておけば、実質下書きのような扱いになる


### Markdown

* Frontmatter
* 見出し：h1,h2,h3,h4
* 改行：br
* 段落：p
* 箇条書き：li,ul,ol
* 画像表示：img
* 強調：strong
* コード：code
* コードブロック：pre,code
* カスタムブロック
* 区切り線
* 表
* 絵文字表示


## TODO

* プロフィールページ更新（パイチャートとか入れる？）
* サムネイル画像設定
* ページャー実装
* アナリティクス対応


## コーディングスタイル

### 全般

* 文字列はダブルクオート優先で囲う
* インデント：半角スペース2個


### JavaScript

* サイズ単位
  * 文字サイズ：px
  * マージン、パディング：rem
  * 要素のサイズ：%
* 末尾のセミコロンは省略する
* `.vitepress/theme/components`内に格納


## Vue.js

* script、template、styleの順で書く
* `.vitepress/theme/components`内に格納