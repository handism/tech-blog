# AWS Patterns（`patterns/`）

- パターンの一覧は `gallery-meta.json` が正（`src/types/aws-gallery.ts` の Zod スキーマでバリデーション）。
- `draw.io/` が図の原本。`img/*.drawio.svg` はそこからのエクスポート結果であり、直接編集しない。
- `src/lib/aws-gallery-repository.ts` が `iac/*.yaml` と `img/*.drawio.svg` を更新日時比較で `public/patterns/` に自動コピーする。

## SVG エクスポート

> **注意**: `drawio` CLI で SVG 出力する際、`--embed-diagram` オプションを付けるとプロセスがハングする事象が確認されています。このオプションは**除外**して使用すること。

```bash
drawio --export --format svg --svg-theme light --border 10 \
  --output "patterns/img/<name>.drawio.svg" \
  "patterns/draw.io/<name>.drawio"
```
