# DESIGN_GLITCH.md — Glitch Art テーマ詳細仕様

## コンセプト
デジタルの「崩壊」と「バグ」をあえてアートとして昇華させたGlitch Artテーマ。RGBチャンネルのずれ（クロマティックアベレーション）、スキャンライン、データ破損のような視覚効果でサイバーパンクな緊張感を演出。

## カラーパレット

### ベース（常にダーク基調）
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#050508` | ほぼ黒 |
| `--color-card` | `#0a0a12` | 深い黒紫 |
| `--color-text` | `#e0e0ff` | 淡い紫がかったホワイト |
| `--color-border` | `rgba(255,0,144,0.4)` | 半透明ピンク |
| `--color-accent` | `#ff0090` | ネオンピンク |

### ライトモード（暗め）
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#0d0d1a` | 少し明るい黒紫 |

### ダークモード（より暗く）
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#010103` | 究極の黒 |
| `--color-accent` | `#ff40b0` | より明るいピンク |

## フォント
- **見出し/本文**: `'Share Tech Mono', monospace`（既存・ターミナル風）
- 等幅・ハードなデジタル感

## 背景
CRTスキャンライン風のストライプパターン（2pxピッチ、微細なシアングロー）

## 見出しアニメーション
```css
/* RGBズレ効果（クロマティックアベレーション） */
@keyframes glitch-rgb {
  0%, 100% { text-shadow: -2px 0 #ff0090, 2px 0 #00fff0; }
  25%       { text-shadow: 2px 0 #ff0090, -2px 0 #00fff0; }
  50%       { text-shadow: -2px 2px #ff0090, 2px -2px #00fff0; }
  75%       { text-shadow: 2px -2px #ff0090, -2px 2px #00fff0; }
}
/* 6秒サイクルで微妙にずれ続ける */
animation: glitch-rgb 6s infinite;
```

## コードブロックアニメーション
```css
/* データ破損風のclip-pathグリッチ */
@keyframes glitch-border {
  0%, 90%, 100% { clip-path: none; opacity: 1; }
  92% { clip-path: inset(20% 0 50% 0); transform: translateX(-2px); }
  94% { clip-path: inset(60% 0 10% 0); transform: translateX(2px); }
  96% { clip-path: inset(40% 0 30% 0); transform: translateX(-1px); }
}
/* 8秒に1回グリッチ */
animation: glitch-border 8s infinite;
```

## カードスタイル
- 角丸: `2px`（ほぼ直角）
- シャドウ: ネオンピンクグロー + シアングロー
- ホバー: RGBズレ風の二重シャドウ

## アクセシビリティ
`@media (prefers-reduced-motion: reduce)` でアニメーション停止、静的なRGBズレ `text-shadow` のみ適用
