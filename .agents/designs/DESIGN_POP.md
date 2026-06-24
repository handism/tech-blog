---
version: alpha
name: Pop Design
description: カラフルで陽気、遊び心に満ちたビビッド＆ポップな世界観。明るい配色と弾むようなアニメーション。
colors:
  primary: "#f43f5e"
  secondary: "#7c2d12"
  neutral: "#fffbeb"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Space Grotesk, system-ui, sans-serif
rounded:
  card: 16px
  btn: 12px
---

## Overview
Pop Design（ポップ・デザイン）は、カラフルで楽しく、見る人をワクワクさせるような親しみやすさを第一にしたスタイルです。オレンジやイエロー、ローズピンクといった明るいトーンを多く使い、クリック時に弾むようなホバーアニメーションを設定します。

## Elevation & Depth
- **楽しげな影:** 太めの境界線（`2px`）とオレンジやピンクのハードシャドウ（`4px 4px 0px 0px var(--color-border)`）を組み合わせます。
- **バウンドアニメーション:** ホバーすると要素がわずかに拡大しながら飛び出すような、コミカルで弾むようなイージング効果（`scale(1.02) translateY(-2px)`）を適用します。
