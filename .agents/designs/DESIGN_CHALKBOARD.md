# DESIGN_CHALKBOARD.md — Chalkboard テーマ詳細仕様

## コンセプト
黒板（Chalkboard）をテーマにしたノスタルジックで温かみのあるデザイン。深緑の黒板背景にチョークで書いたような手書き感のあるタイポグラフィと境界線。

## カラーパレット

### ライトモード（黒板グリーン基調）
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#2d4a3e` | 深い黒板グリーン |
| `--color-card` | `#243d32` | より暗い緑のカード |
| `--color-text` | `#f0ece0` | チョークホワイト（わずかなクリーム） |
| `--color-border` | `rgba(240,236,224,0.5)` | 半透明チョーク色ボーダー |
| `--color-accent` | `#f0e68c` | チョーク黄（ハイライト） |

### ダークモード
| 用途 | 値 | 説明 |
|------|-----|------|
| `--color-bg` | `#141f1b` | 消えかけた黒板の暗さ |
| `--color-card` | `#0f1812` | ほぼ黒に近い深緑 |
| `--color-text` | `#f5f2e8` | 明るいチョーク色 |

## フォント
- **見出し/本文**: `'Caveat', 'Noto Sans JP', cursive`
- 手書き風のやわらかいカーシブ体

## 背景
水平線ストライプパターン（28pxピッチ）で黒板の横線ルーラー感を演出

## カードスタイル
- ボーダー幅: `2px`（チョークの線のような太さ）
- 角丸: `8px`（やわらかい丸み）
- ホバー: `translateY(-3px) rotate(-0.3deg)`（黒板に貼ったカードが浮く感じ）

## ボタンスタイル
- フォント: `Caveat`
- 重さ: `700`（はっきりした手書き感）
- ホバー時: わずかな傾き `rotate(0.3deg)`

## 特徴的なCSSパターン
```css
/* 手書き見出し */
h1, h2, h3, h4 {
  font-family: 'Caveat', cursive;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3); /* チョーク粉感 */
}

/* 黒板横線 */
body {
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 28px,
    rgba(240,236,224,0.04) 28px,
    rgba(240,236,224,0.04) 29px
  );
}
```
