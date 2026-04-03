# GitHub Copilot — ワークスペース指示

目的

- このリポジトリで Copilot / GitHub AI が安全かつ効率的に作業するための最小限のガイド。

クイック参考コマンド

- 開発サーバー: `npm run dev`
- 本番ビルド: `npm run build` → 出力は `out` ディレクトリ
- 本番サーバー（静的配信）: `npm run start`
- ESLint: `npm run lint`
- ユニットテスト（Vitest）: `npm run test:unit`
- E2E（Playwright）: `npm run test:e2e` / `npm run test:e2e:ui`

主要な設計と慣習（短縮版）

- フレームワーク: Next.js 16（App Router） — SSG（`output: 'export'`）で静的サイトを生成します。
- コンテンツ: Markdown ファイルを `md/` に置き、`src/lib/` のパイプラインで処理します。
  - 参照: [src/lib/post-repository.ts](src/lib/post-repository.ts), [src/lib/post-parser.ts](src/lib/post-parser.ts), [src/lib/post-renderer.ts](src/lib/post-renderer.ts)
- サイト設定: [src/config/site.ts](src/config/site.ts)

重要ファイル（参照用）

- リポジトリの概要: [README.md](README.md)
- 作業コマンドとアーキテクチャのメモ: [.claude/CLAUDE.md](.claude/CLAUDE.md)
- package.json（npm スクリプト）: [package.json](package.json)

作業ポリシー（エージェント向け）

- 小さな変更（ドキュメント改善・小さなバグ修正・リファクタ）は PR を作成してください。
- 重大な変更（ルーティング、出力形式、デプロイ先、サイト URL 変更など）は事前に人間に相談してください。
- 生成される静的ファイル（`out/`）やデプロイ設定を直接変更しないでください。

チェックすべきポイント（PR を作る前）

- `npm run lint` が通ることを確認
- ユニットテスト / E2E のうち該当するものを実行して破壊的変更がないか検証
- コンテンツ変更の場合、`md/` 内の frontmatter が Zod のスキーマに準拠していること

例示的プロンプト（そのまま試せます）

- 「このリポジトリの ESLint エラーを検出して修正案を出して」
- 「`src/lib/post-renderer.ts` のパフォーマンス改善案を箇条書きで」
- 「`md/` にある記事の frontmatter が Zod スキーマに合致しているかチェックして」
- 「新しいブログ記事テンプレートを作成して、必要な frontmatter と例を示して」

提案される追加エージェント/カスタマイズ

- フォーマット専用エージェント: `format-agent` — `prettier`/`eslint --fix` を自動提案。PR 作成支援。
- テストランナーエージェント: `test-agent` — 該当スクリプトを実行し、失敗の原因を要約。
- コンテンツ作成エージェント: `content-agent` — Markdown テンプレートの作成と frontmatter のバリデーションを自動化。

最後に

- まずはこのファイルをベースに運用し、必要に応じてセクションを増やしてください。
- 変更を適用する場合は PR を作成し、CI（lint/test） が通ることを確認してください。
