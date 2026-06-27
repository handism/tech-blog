# DESIGN_HOLOGRAPHIC.md — Holographic テーマ詳細仕様

## コンセプト
オーロラ・プリズム・クリスタルをテーマにしたホログラフィックデザイン。多面体グラデーション、光の屈折、輝くオーロラカラーで幻想的・未来的な美しさを表現する。

## カラーパレット

### ダーク基調（デフォルト）
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#0c0818` | 宇宙の深い紫黒 |
| `--color-card` | `rgba(255,255,255,0.06)` | 透明ガラス感 |
| `--color-text` | `#e8e0ff` | 淡い紫のホワイト |
| `--color-border` | `rgba(168,85,247,0.35)` | 半透明パープル |
| `--color-accent` | `#a855f7` | ビビッドパープル |

### ライトモード
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#f0eaff` | 淡いラベンダー |
| `--color-card` | `rgba(255,255,255,0.75)` | 半透明ホワイト |
| `--color-text` | `#1e0a3c` | 濃い紫黒 |
| `--color-border` | `rgba(168,85,247,0.4)` | 半透明パープル |
| `--color-accent` | `#7c3aed` | 濃いバイオレット |

## フォント
- **見出し/本文**: `'Outfit', 'Lexend', sans-serif`
- モダン・未来的なサンセリフ体

## 背景
3つのラジアルグラデーション（紫・青・ピンク）が重なる宇宙的な背景

## カードスタイル
- ガラスモーフィズム: `backdrop-filter: blur(16px) saturate(1.5)`
- 角丸: `16px`（やわらかい曲線）
- シャドウ: パープルのグロー + インナーハイライト
- ホバー: `translateY(-4px)` + より強い発光

## 見出しアニメーション
```css
/* グラデーションテキストアニメーション */
background: linear-gradient(135deg, #c084fc, #818cf8, #38bdf8, #c084fc);
background-size: 200% auto;
animation: holo-shimmer 4s linear infinite;

@keyframes holo-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## アクセシビリティ
`@media (prefers-reduced-motion: reduce)` でアニメーションを停止
