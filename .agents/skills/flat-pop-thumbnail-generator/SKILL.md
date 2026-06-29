---
name: flat-pop-thumbnail-generator
description: ブログのサムネイル用に鮮やかな「フラットポップ」調のアニメイラストを生成し、sipsで16:9にクロップし、cwebpでWebPに変換して、記事のフロントマターを更新する手順をエージェントに指示します。
---

# フラットポップ調サムネイルジェネレーター・スキル

ユーザーがブログ記事のサムネイルを「フラットポップ」または「ポップアート風アニメ」スタイルで作成・再作成することを要求した際、このスキルを使用してください。

## ワークフロー

### 1. 画像生成 (`generate_image`)
`generate_image` ツールを使用して 1:1（正方形）の画像を生成します。プロンプトには、望ましい「フラットポップ」外観を実現するために以下のコア要素を必ず組み込んでください。

- **スタイルキーワード (Style Keywords)**: `superflat pop-art anime`, `vibrant high-saturation palette`, `bold graphic shapes`, `flat color blocking`, `flat shading only`, `hard color boundaries`, `bold black outlines`, `clean line-art`, `clean crisp edges`.
- **ネガティブプロンプト (Negative Prompts)**: グラデーションなし (`no gradients`)、影なし (`no shadows`)、奥行き表現なし (`no depth cues`)、リアルな質感なし (`no realistic textures`)、3Dレンダリングなし (`no 3d rendering`)、ぼやけた線なし (`no blurry lines`)、テキストなし (`no text`)、透かしなし (`no watermark`)。
- **構図 (Composition)**: メインのキャラクターやオブジェクトを中央に配置し、周囲に十分な余白を残します（後で 16:9 にクロップするため）。
- **背景 (Background)**: 幾何学模様、星、稲妻ボルト（⚡）、アメコミ風の「ZAP!」吹き出し、白黒のハーフトーン（ドット）などが散りばめられた、カラフルなポップアート背景。

#### プロンプトテンプレート例
```text
superflat pop-art anime [キャラクター/オブジェクトの説明], vibrant high-saturation palette, bold graphic shapes, flat color blocking, [髪/衣服の色などの詳細], flat shading only, hard color boundaries, stylized anime face, star reflections in the eyes, bright smile, [衣装の詳細] with pop-art patterns, geometric shapes, floral symbols, sticker-like decorations, [ポーズやジェスチャーの詳細], white background with flat colorful pop-art shapes, bold vector-like graphics, clean crisp edges, poster-style pop-art motifs, clean line-art, ultra-bright colors, masterpiece --no gradients, shadows, depth cues, realistic texture, 3d rendering, messy shading, blurry lines, text, watermark
```

---

### 2. 16:9へのクロップとフォーマット変換 (`sips`)
生成される画像は通常正方形（1024x1024）です。macOS標準のユーティリティ `sips` を使用して、ブログ推奨の 16:9（1024x576）の長方形に中央基準でクロップし、フォーマットを確実にPNGに変換します（生成エンジンがPNG拡張子のまま中身をJPEGで出力することがあるため）。

```bash
# 中央基準で 1024x576（高さ576、幅1024）にクロップ
sips --cropToHeightWidth 576 1024 <生成された画像のパス>.png --out public/images/<ファイル名>-flatpop.png

# 内部フォーマットを確実にPNGに変換
sips -s format png public/images/<ファイル名>-flatpop.png --out public/images/<ファイル名>-flatpop.png
```

---

### 3. WebP形式への変換と圧縮 (`cwebp`)
クロップ済みのPNGファイルを、Homebrewでインストールした `cwebp` コマンドを使用してWebP形式に圧縮・変換します。画質クオリティは 85 に設定します。

```bash
# PNGをWebP（品質85）に変換
cwebp -q 85 public/images/<ファイル名>-flatpop.png -o public/images/<ファイル名>-flatpop.webp

# 中間生成物であるPNGファイルを削除してクリーンアップ
rm public/images/<ファイル名>-flatpop.png
```

---

### 4. 記事フロントマターの更新
対象のブログ記事マークダウンファイル（例: `md/<ファイル名>.md`）を開き、フロントマターの `image` フィールドを新しく作成した `.webp` ファイルに更新します。

```yaml
---
title: ...
date: ...
image: <ファイル名>-flatpop.webp
---
```

---

### 5. 表示確認と検証
Next.jsの開発サーバーを起動してレイアウトを確認します。
```bash
bun run dev
```
ブラウザ subagent を使用してローカルURL（例: `http://localhost:3000/blog/posts/<スラグ>`）を確認し、詳細ページおよび記事一覧カードの手前でサムネイルが美しく描画されていることを確認し、スクリーンショットを撮影します。
