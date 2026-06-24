---
version: alpha
name: Material Design
description: 物理的な紙とインクの概念を取り入れ、滑らかな角丸と控えめなドロップシャドウで階層を示すスタイル。
colors:
  primary: "#6200ee"
  secondary: "#212121"
  neutral: "#f5f5f5"
  card: "#ffffff"
typography:
  font-sans:
    fontFamily: Roboto, Inter, system-ui, sans-serif
rounded:
  card: 8px
  btn: 4px
---

## Overview
Material Design（マテリアルデザイン）は、Googleが提唱したデザインシステムです。デジタル画面上で現実の「紙」と「インク」のような質感をシミュレートし、影による立体階層（z-index / elevation）を基にユーザーの視線を誘導します。

## Elevation & Depth
- **影の階層:** 紙が浮き上がっているような自然なドロップシャドウ（`0 2px 5px rgba(0, 0, 0, 0.1)`）を適用します。
- **ホバーアクション:** 手前に少し浮き上がるようなアニメーション（`translateY(-2px)`）と、シャドウの広がり・濃さの強化で直感的なクリック感を提供します。
