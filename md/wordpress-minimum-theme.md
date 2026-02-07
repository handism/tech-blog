---
title: WordPressの最小構成のブログテーマを自作する
date: 2024-01-09
tags: [WordPress, Blog, PHP]
category: Frontend
image: many-letters.webp
---

## 経緯

勉強がてらWordPressのテーマを自作してみたので手順を記載しておく。

## WordPressのテーマの自作手順

テーマを自作した際の手順は以下の通り。順番に深堀りしていく。

1. まずHTMLでマークアップ
2. HTMLをテンプレートタグに変換
3. CSSで装飾
4. テーマのインストール

## ① まずHTMLでマークアップ

まずはどんなブログにしたいかの構想を練る。結果、以下のようなブログにしようと考えた。

- レスポンシブデザイン
- 1カラム
- なるべくシンプルに
- HTML5/CSS3に準拠

構想が練れたら、早速HTMLでブログサイトを作成していく。

VSCodeで任意のフォルダに`index.html`というファイル名でテキストファイルを作って更新。

構想に沿ってHTMLでマークアップしてみた結果が以下。HTML5に準拠することを意識してみた。

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>ブログタイトル</title>
    <link rel="stylesheet" href="CSSのURL" />
  </head>
  <body>
    <header>
      <h1><a href="ブログのURL">ブログタイトル</a></h1>
    </header>
    <nav>
      <ul>
        <li>カテゴリ1</li>
        <li>カテゴリ2</li>
        <li>カテゴリ3</li>
      </ul>
    </nav>
    <main>
      <article>
        <h2><a href="記事のURL">記事のタイトル</a></h2>
        <time>更新日 更新日時</time>
        <div class="category">カテゴリ</div>
        <div class="article"></div>
      </article>
      <div id="pager">
        <div id="pager-prev">前の記事</div>
        <div id="pager-next">次の記事</div>
      </div>
    </main>
    <footer>
      <small>© 2017 <a href="ブログのURL">ブログタイトル</a></small>
    </footer>
  </body>
</html>
```

こちらをブラウザで開くと、当然だが素っ気ないウェブサイトが表示される。

## ② HTMLをテンプレートタグに変換

HTMLが完成したら、HTML内の実際の値が入る部分をWordPressのテンプレートタグに置き換えていく。

結果は以下となった。

```php
<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title><?php if ( is_home() ) { bloginfo(); } else { wp_title(""); ?> | <?php bloginfo(); } ?></title>
        <link rel="stylesheet" href="CSSのURL">
    </head>
<body>
    <header>
        <h1><a href="<?php echo home_url() ?>"><?php bloginfo() ?></a></h1>
    </header>
    <nav>
        <ul>
            <?php wp_list_categories("title_li="); ?>
        </ul>
    </nav>
    <main>
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article>
                    <h2><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h2>
                    <time><?php the_date(); ?> <?php the_time(); ?></time>
                    <div class="category"><?php the_category("") ?></div>
                    <div class="article"><?php the_content('[続きを読む]'); ?></div>
                </article>
            <?php endwhile; ?>
            <div id="pager">
                <div id="pager-prev"><?php previous_posts_link("前の記事"); ?></div>
                <div id="pager-next"><?php next_posts_link("次の記事", ""); ?></div>
            </div>
        <?php else : ?>
            <h2>Not Found</h2> <p><?php _e("記事が見つかりませんでした。"); ?></p>
        <?php endif; ?>
    </main>
    <footer>
        <small>© 2024 <a href="<?php echo home_url() ?>"><?php bloginfo() ?></a></small>
    </footer>
</body>
</html>
```

タグを置き換えたら、拡張子を変更して`index.php`とする。

## ③ CSSで装飾

テンプレートタグを実装し終わったら、いよいよCSSで見た目を良くしていく。

ファイル名は`style.css`とした。

ここでは、「`Google HTML/CSS Style Guide`」に従うことを意識して作業。  
https://google.github.io/styleguide/htmlcssguide.html

```css
@charset "utf-8";
/*
Theme Name: 〇〇〇
*/
/***** 全体の設定 *****/
* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #fff;
  color: #454545;
  font:
    15px 'Helvetica Neue',
    'Helvetica',
    'Arial',
    'Hiragino Kaku Gothic Pro',
    'Meiryo',
    'MS PGothic',
    sans-serif;
  margin: auto;
  width: 90%;
}

a {
  color: #1487bd;
}

a:hover {
  color: #0f5373;
}

a:visited {
  color: #789dae;
}

/***** ヘッダ部 *****/
header {
  margin: 50px;
  text-align: center;
}

header a,
header a:visited {
  color: #454545;
  text-decoration: none;
}

/***** ナビゲーションバー *****/
nav ul {
  list-style-type: none;
  margin: 20px;
  text-align: center;
}

nav ul li {
  background: #aaa;
  border-radius: 3px;
  display: inline-block;
  margin: 2px;
  padding: 3px 5px;
}

nav ul li a,
nav ul li a:visited {
  color: #fff;
  font-size: 70%;
  text-decoration: none;
}

/***** メイン部 *****/
article {
  overflow: hidden;
}

h2 {
  font-size: 150%;
  margin: 1rem 0;
}

h2 a,
h2 a:visited {
  color: #454545;
  text-decoration: none;
}

time {
  font-weight: bold;
  margin: 1rem 0;
}

.category {
  font-size: 80%;
  margin: 1rem 0;
}

.category a {
  background: #aaa;
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  font-size: 70%;
  margin-right: 2px;
  padding: 3px 5px;
  text-decoration: none;
}

.article {
  line-height: 2rem;
}

.article h3 {
  border-bottom: solid 1px;
  border-left: solid 20px;
  font-size: 120%;
  margin-top: 30px;
  padding: 5px 5px 5px 15px;
}

.article p {
  margin: 1rem 0;
}

.article blockquote {
  border: 1px solid;
  font-style: oblique;
  padding: 0 10px;
  margin: 0 10px;
}

.article ol li {
  list-style: decimal;
  margin-left: 30px;
}

.article ul li {
  list-style: circle;
  margin-left: 30px;
}

#pager {
  margin: 1rem 0;
  text-align: center;
}

#pager a {
  background: #aaa;
  border-radius: 3px;
  color: #fff;
  display: inline-block;
  margin-right: 2px;
  padding: 3px 5px;
  text-decoration: none;
}

#pager:after {
  clear: both;
  content: '.';
  display: block;
  font-size: 0;
  height: 0;
  visibility: hidden;
}

#pager-prev {
  display: inline-block;
  float: left;
  text-align: left;
  width: 45%;
}

#pager-next {
  display: inline-block;
  float: right;
  text-align: right;
  width: 45%;
}

/***** フッタ部 *****/
footer {
  margin: 50px;
  text-align: center;
}

footer small {
  font-size: 80%;
}

footer a,
footer a:visited {
  color: #454545;
  text-decoration: none;
}
```

WordPressのテンプレートタグが最終的にどんなタグに展開されるかが、この段階では分かりにくいので最低限の装飾とした。

## ④ テーマのインストール

上記の`index.php`および`style.css`が完成した時点でテーマが動作するようになる。つまりは最小構成はこの2ファイルがあればいいということ。

この2ファイルをテーマ名を冠したフォルダに入れてzip化したら準備は完了。WordPressの管理画面にログインし、`外観 ＞ テーマ`から「新規追加」を押下後、「テーマのアップロード」ボタンで先ほどのzipファイルをアップロードすれば自作テーマのインストールできる。

あとは、URLにアクセスして実際に表示してみながらHTMLやCSSを調整していく。`外観 ＞ テーマの編集` からHTMLやCSSを編集可能。

## ⑤ WordPressの設定変更

自分の行った設定は以下の通り。

- WordPressやプラグインの最新化
- 一般設定
  - サイトのタイトル：入力
  - キャッチフレーズ：入力
  - WordPressアドレス(URL)：httpsに変える
  - サイトアドレス(URL)：httpsに変える
  - 日付形式：Y年n月j日
  - 時刻形式：H:i
- 表示設定
  - ホームページの表示：最新の投稿
  - 1ページに表示する最大投稿数：18件
- メディア設定
  - サムネイルのサイズ
    - 幅：0
    - 高さ：0
  - 中サイズ
    - 幅の上限：0
    - 高さの上限：0
  - 大サイズ
    - 幅の上限：812
    - 高さの上限：0
- パーマリンク設定
  - パーマリンク構造：投稿名

## ⑥ プラグインのインストール

個人的なお気に入りプラグインは以下の通り。

- BackWPup
- Contact Form 7
- Customizer Export/Import
- Media File Renamer: Rename Files (Manual, Auto, AI)
- Safe SVG
- SEO SIMPLE PACK
- WP Multibyte Patch
- WP Revisions Control
- XML Sitemap & Google News
