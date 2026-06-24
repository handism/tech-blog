---
version: alpha
name: Flat Design
description: 影やグラデーションを一切使用せず、単色でシンプルな幾何学的形状と高いコントラストを持つ究極にシンプルなスタイル。
colors:
  primary: "#3b82f6"
  secondary: "#1e293b"
  neutral: "#e2e8f0"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Inter, system-ui, sans-serif
rounded:
  card: 8px
  btn: 6px
---

## Overview
Flat Design（フラットデザイン）は、3Dの要素、質感、グラデーション、シャドウなどの装飾をすべて排除し、シンプルさと機能性を追求したスタイルです。情報の伝達に集中するための明快なカラーブロックとレイアウトが特徴です。

## Elevation & Depth
- **立体感の排除:** 要素の影（`box-shadow`）は完全に `none` です。
- **コントラストによる境界の表現:** 要素同士の重なりは影ではなく、背景色とカード色の明確な色コントラスト、または細いフラットな境界線によってのみ識別されます。
- **ホバーアクション:** 3D的な飛び出しはなく、純粋な色の変化（ホバー時に背景色が少し暗くなるなど）で表されます。
