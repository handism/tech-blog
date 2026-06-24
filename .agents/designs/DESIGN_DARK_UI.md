---
version: alpha
name: Dark UI Only
description: ライトモード・ダークモードを問わず、常に洗練された深い黒とダークグレーを基調とする目に優しいダークテーマ。
colors:
  primary: "#38bdf8"
  secondary: "#f9fafb"
  neutral: "#030712"
  card: "#111827"
typography:
  font-sans:
    fontFamily: Inter, system-ui, sans-serif
rounded:
  card: 8px
  btn: 6px
---

## Overview
Dark UI Only（ダークUI）は、昼夜を問わず「ダークモード（常に黒基調）」で表示される、洗練されたプログラマー仕様のデザインです。深い暗闇に浮かび上がる細い境界線と、目に優しいシアンのアクセントカラーによって、集中力を高める空間を作り出します。

## Elevation & Depth
- **ダークレイヤー:** 背景にはほぼ純黒（`#030712`）、カードにはやや明るいグレー（`#111827`）を重ねることで階層を表現します。
- **グローシャドウ:** 影は暗い色ではなく、ホバー時に周囲に静かに青色光が溶け出すようなグロー効果（`0 0 10px rgba(56, 189, 248, 0.15)`）として機能させます。
