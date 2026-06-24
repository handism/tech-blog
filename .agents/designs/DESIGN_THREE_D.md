---
version: alpha
name: 3D Interactive
description: 圧倒的な厚みと立体感。太いボトムベベルシャドウと、クリック時の本格的な押し込みインタラクション。
colors:
  primary: "#0ea5e9"
  secondary: "#0f172a"
  neutral: "#f1f5f9"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Space Grotesk, system-ui, sans-serif
rounded:
  card: 12px
  btn: 8px
---

## Overview
3D Interactive（3D UI）は、UI要素を本物の物理的スイッチや立体プレートのように表現する、遊び心のあるスタイルです。要素の下部に明快な「厚み（ベベル）」を設けることで、押せること（アフォーダンス）を強力に伝えます。

## Elevation & Depth
- **物理的な厚み:** カードやボタンの底面にソリッドな3D厚み（`0 8px 0px 0px #cbd5e1`）を持たせます。
- **クリック押し込み効果:** ボタンをクリック（アクティブ）すると、`translateY(4px)` して底面の厚みが `0px` に縮む（実際にスイッチが沈み込んだような）アニメーションを完璧に再現します。
