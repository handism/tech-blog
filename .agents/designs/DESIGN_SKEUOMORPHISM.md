---
version: alpha
name: Skeuomorphism
description: 現実の立体物のような質感、強いグラデーション、内側のハイライト、面取り（ベベル＆エンボス）を取り入れたデザイン。
colors:
  primary: "#4b5563"
  secondary: "#374151"
  neutral: "#e5e7eb"
  card: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)"
typography:
  font-sans:
    fontFamily: system-ui, sans-serif
rounded:
  card: 12px
  btn: 8px
---

## Overview
Skeuomorphism（スキューモーフィズム）は、デジタル機器の画面上に、現実世界の質感（木、金属、ガラス、革など）や三次元的な奥行きを忠実に再現するデザインアプローチです。

## Elevation & Depth
- **光と影の演出:** カードやボタンの上部には光源を意識した白いハイライト（`inset 0 1px 0 rgba(255,255,255,0.8)`）、下部にはドロップシャドウを落とします。
- **ベベル＆エンボス:** 強い線形グラデーションを使用し、ボタンやヘッダーにぷっくりとした「押し応えがありそうな」物理的質感を与えます。
