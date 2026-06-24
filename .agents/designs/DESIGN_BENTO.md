---
version: alpha
name: Bento Grid
description: 弁当箱のように美しく整列した可変サイズグリッド。大きめの角丸と滑らかで上質な拡大ホバー効果。
colors:
  primary: "#10b981"
  secondary: "#1e293b"
  neutral: "#f1f5f9"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Lexend, system-ui, sans-serif
rounded:
  card: 16px
  btn: 10px
---

## Overview
Bento Grid（弁当UI）は、Appleの製品紹介や最新のモダンUIでトレンドとなっている、日本の「弁当箱」のように様々なサイズの角丸長方形を規則正しく敷き詰めるレイアウト様式から着想を得たスタイルです。個々のグリッドセル（カード）が独立した役割を持ち、全体で1つの調和したダッシュボードを作ります。

## Elevation & Depth
- **大きめの角丸と微細境界:** カードは丸っこい角丸（`16px`）と、極薄のボーダー（`rgba(15, 23, 42, 0.04)`）で仕切られ、整然とした清潔感を与えます。
- **吸い付くようなホバー:** ホバー時には、カードがすっと滑らかに拡大し（`scale(1.02)`）、奥から自然なブラー影が広がります。
