---
title: remarkで日本語の「」や句読点に隣接する強調記号（太字）が効かない問題の解決策
date: 2026-07-04
tags: [markdown, remark, unified, frontend]
---

Markdownをレンダリングする際、日本語の「」や全角括弧、読点などの直前・直後に `**` や `~~` を配置すると、強調（太字）や取り消し線が正しくレンダリングされず、生の記号がそのまま表示されてしまう問題があります。

### 現象
以下のようなMarkdownをパースした際、強調が効きません。

```markdown
個人開発を経験することで**「全体を俯瞰する視野」**が養われます。
```

### 原因
CommonMarkの仕様において、強調デリミタ（`**` や `*`）の開始・終了は、記号の前後にある文字が「空白（Whitespace）」か「句読点（Punctuation）」かによって判定されます。

日本語の「」や（）はUnicode仕様上「句読点（Punctuation）」に分類されます。しかし、日本語は分かち書きをしないため、文字の間にスペースが入りません。
そのため、`る**「全` のように、記号の前に通常文字（`る`）があり、後に句読点（`「`）がある組み合わせになると、パーサが開始デリミタ（left-flanking）として判定できなくなってしまいます。

### 解決策
CJK（中国語、日本語、韓国語）環境でのパース不具合を補正する remark プラグインである **`remark-cjk-friendly`**（太字・斜体用）および **`remark-cjk-friendly-gfm-strikethrough`**（GFMの取り消し線用）を導入します。

#### 1. パッケージのインストール
```bash
bun add remark-cjk-friendly remark-cjk-friendly-gfm-strikethrough
```

#### 2. パーサ（Unified）への追加
`unified` 処理パイプラインにおいて、`remarkParse` および `remarkGfm` の直後にこれらのプラグインを適用します。

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCjkFriendly) // 太字・斜体用
  .use(remarkCjkFriendlyGfmStrikethrough) // 取り消し線用
  // ...その後の処理
```

これで、`**「テキスト」**` のような日本語特有の記述でも、期待通り `<strong>「テキスト」</strong>` に変換されるようになります。
