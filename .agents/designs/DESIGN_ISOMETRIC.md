---
version: alpha
name: Isometric 2.5D
description: 2.5D（等角投影図）のグリッド感をシミュレートした、斜めに長く伸びる立体的な影と斜め上にせり出すホバー効果。
colors:
  primary: "#4f46e5"
  secondary: "#1e293b"
  neutral: "#f8fafc"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Space Grotesk, system-ui, sans-serif
rounded:
  card: 8px
  btn: 6px
---

## Overview
Isometric（アイソメトリック）は、テクニカルイラストレーションや2.5Dゲームで使用される等角投影図法（アイソメトリックプロジェクション）から着想を得たスタイルです。影を右下方向へ平行に長く伸ばし、ホバー時には要素を斜め左上方向へ浮遊させることで、まるで画面から階段状に突き出ているかのような錯覚を作ります。

## Elevation & Depth
- **平行な斜め影:** 通常のぼかし影ではなく、インディゴカラーのソリッドな平行多重影（`4px 4px 0px rgba(79, 70, 229, 0.1), 8px 8px 0px rgba(79, 70, 229, 0.05)`）を用いて2.5Dの厚みをシミュレートします。
- **斜め浮遊アクション:** ホバー時には、`translate(-4px, -4px) rotateX(2deg) rotateY(-2deg)` の変形を加え、カードが本当に傾きながら浮き上がる立体表現を行います。
