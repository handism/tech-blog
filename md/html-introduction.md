---
title: HTMLに入門する
date: 2024-01-10
tags: [HTML]
image: many-monitors.webp
---


## HTMLの基礎知識

### 文書型宣言

```html
<!DOCTYPE html>
```

### 文字エンコーディング

```html
<meta charset="UTF-8" />
```

### テンプレ

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>タイトル</title>
<link rel="stylesheet" href="style.css">
<script src="main.js"></script>
</head>
<body>
<!-- コンテンツ -->
</body>
</html>
```

### section
章や節。

```html
<section>
    <h2>見出し</h2>
    <p>本文</p>
</section>
```

見出し＋本文。

### article
ブログの投稿など、切り出しても独立したコンテンツとして再利用可能なもの。

```html
<article>
    <h1>大見出し</h1>
    <p>本文</p>
    <section>
        <h2>小見出し</h2>
        <p>本文</p>
    </section>
</article>
```

### nav
ナビゲーション。サイト内のページリンクの集まり。

```html
<nav>
    <ul>
        <li></li>
    </ul>
</nav>
```

### aside
メインのコンテンツとは関連が薄く、切り離せるコンテンツ。

補足、サイドバー、広告とか。

### hgroup
見出しと、付随する小見出し、副題、キャッチフレーズ。

h1～h6しかいれちゃだめ。


### header


### footer


### hr
段落レベルの区切り。


### small
著作権表記とか権利とか。細目。


### strong
重要性。強調じゃない。


### i
イタリック。


### b
意味を持たず、キーワードみたいな区別。


### address
連絡先のみ。


### canvas
図形を書く。HTML+jsのみで図形が描けるとか。


### 廃止要素
center,font,frameとか。