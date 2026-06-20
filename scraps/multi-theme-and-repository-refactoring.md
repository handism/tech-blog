---
title: CSS変数とカスタムデータ属性による動的テーマ・スキン切り替えとリポジトリの共通化
date: 2026-06-20
tags: [CSS, Next.js, DesignSystem, Refactoring]
---

ここ数日、このブログに対して加えた大きな設計変更とリファクタリングのノウハウをまとめます。

## 1. CSS変数と `data-*` 属性による動的マルチテーマ＆スキン設計

レイアウトや枠線、影といった「テーマの質感」と「アクセントカラー（スキン）」を直交させて制御する仕組みを構築しました。

- `data-theme` 属性: Neo-Brutalism, Glassmorphism, Minimal, Neumorphism, Cyberpunk, Retro などのデザインテーマを制御
- `data-skin` 属性: Emerald, Ocean, Sunset, Purple, Rose などのアクセントカラーを制御

### 設計のポイント
1. **抽象スタイルの定義**:
   コンポーネントには個別のスタイルを直接書き込まず、`.theme-card` や `.theme-btn` といった抽象クラスを付与しておきます。
2. **テーマ別の差分定義**:
   `app/globals.css` にて、テーマ別のセレクタで上書きします。
   ```css
   /* Neo-Brutalism */
   [data-theme='neo-brutalism'] .theme-card {
     border: 3px solid var(--color-border);
     box-shadow: 5px 5px 0px 0px var(--color-border);
   }
   /* Glassmorphism */
   [data-theme='glassmorphism'] .theme-card {
     border: 1px solid rgba(255, 255, 255, 0.5);
     backdrop-filter: blur(12px);
   }
   ```
3. **スキンの分離**:
   `data-skin` は `--color-accent` のみを選択的に上書きすることで、すべてのテーマとシームレスに調和します。

## 2. html要素での一元管理とOS同期

ダークモード制御とテーマを安定して連動させるため、ダークモードクラス（`.dark`）を `html` 要素に付与するように変更しました。

また、`matchMedia('(prefers-color-scheme: dark)')` を用いた「OSテーマ同期」オプションを実装しました。これにより、ユーザー設定を維持しつつ、システム preference にも瞬時に反応するアクセシビリティの向上を実現しています。

## 3. ファイルアクセスの抽象化（MarkdownRepository）

ブログ記事（`md/`）とScraps（`scraps/`）で共通していた Markdown ファイルの読み込みロジックを、ジェネリックなリポジトリパターンに抽象化しました。

```typescript:src/lib/markdown-repository.ts
export interface MarkdownRepository {
  readAllSources(): Promise<MarkdownSource[]>;
  readSourceBySlug(slug: string): Promise<MarkdownSource | null>;
}
```

各コンテンツタイプのリポジトリは、このファクトリ関数 `createMarkdownRepository(dirPath)` を呼び出すだけでファイル操作ができるようになり、コードの重複を完全に排除（DRY化）できました。

---

この設計により、新テーマや新しいコンテンツ形式の追加、あるいはコンポーネントスタイルの刷新を非常に疎結合に行えるようになりました。
