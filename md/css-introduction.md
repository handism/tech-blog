---
title: CSSに入門する
date: 2024-01-10
tags: [CSS]
category: Frontend
image: cascade-image.webp
---

## CSSの基礎知識

### リセットスタイル

各ブラウザは、タグごとにデフォルトスタイルをそれぞれ持っていて、それをリセットする。

`reset.css`として一番最初に読み込ませるのが良さそう。

### rem,vw

`px,em,%`が既存ではあったが、新たな長さの単位として`rem,vw`がある。

- `em`：親要素を基準とする。2emなら親の2倍
- `rem`：ルートを基準とする。つまりhtmlを基準。レスポンシブデザインならフォントや幅などはこれかも
- `vm`：windowの幅を基準とする
- `vh`：windowの高さを基準とする

```css
html {
     font-size: 11px;
}

h1{
     /* ルート(html)の2倍。*/
     font-size: 2rem;
}
```

### rgba,hsla

色の指定方法。

- `rgba`：赤、緑、青、Alpha(透明度)
- `hsla`：hue(0-360),saturation(0-100%),lightness(0-100%),alpha(0-1)

```css
#box1 {
     background: rgba(255, 100, 100, .2);
}

#box2 {
     background: hsla(255, 100%, 100%, .2);
}
```

### 要素全体の透明

例えば画像とかを透明にしたり。

```css
opacity: 0.3;
```

### 属性セレクタ

```css
-a[href]
-a[href="foo"]
-a[href~="foo"]
-a[href^="foo"]fooから始まる
-a[href$="foo"]fooで終わる
-a[href*="foo"]fooを含む
```

### 疑似クラス

```css
- :first-child
- :last-child
- :nth-child(3)
- :nth-child(odd)とかeven
- :nth-child(3n+1)
- :nth-last-child(4)
- :only-child
- :first-of-type
- :last-of-type
- :nth-of-type(3)
- :nth-last-of-type(4)
- :only-of-type
- :not(.target)
- :empty
- :enabled
- :checked
- ?? (隣接セレクタ)
```

```css
li:last-child {
~~
}
```

### その他もろもろ

#### 角丸

border-radius

```css
border-radius: 30px / 15px;
```

`border-bottom-right-radius`とかもOK。50%を指定すると丸になり、`background`に画像を設定すると丸いアイコンとかも作れる。

#### background-size

coverを指定すると領域全体に画像が。containは縦横比を維持。

#### 線形グラデーション

linear-gradient

```css
background-image: linear-gradient(top left, skyblue, blue);
```

`repeating-linear-gradient`で繰り返し。

#### 円形グラデーション

radial-gradient

#### 影

box-shadow
text-shadow

#### 変形

```css
transform: transrate(20px, 30px);
:scale(0.5, 1.5);
:skew(10deg, 20deg);
:rotate(30deg);
```

`transform-origin`で起点の変更

#### transition

マウスオーバーのアニメーション。

```css
transition-property:
transition-duration:
transition-timing-function: ease ease-out ease-in-out
```

#### animation

キーフレームを使った複雑なアニメーション。

#### box-sizing

widthやheightにpaddingやborderを含めることができる。

#### ユーザーアクション疑似クラス

- :hover
  ↑javascriptの代わりになりそう。

#### 疑似要素

:before

```css
p:before {
  content: "文言" ;
}
```

pタグの中の文章の先頭に特定の文言を追加可能。:afterも同様。

この文言はドラッグしても選択されないためGoogleからも認識されず、SEO効果はないとのこと。

#### 見出しの頭に番号を振る

ちなみに画像も挿入可能。

CSS3的には、疑似要素は::コロン２つらしいので、::beforeが正解？

```css
#no-01:before {
  content:【1】;
}
```

#### calc

CSS上で計算が可能。

```css
width: calc(100% - 20px);
```

#### いろいろ

- Flexible Box
- Feature Query
- image-rendering
- border-image
- text-overflow
- ellipsisでテキストが溢れたら...を加えてくれる
