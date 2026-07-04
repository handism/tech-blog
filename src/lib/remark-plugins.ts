// src/lib/remark-plugins.ts
/**
 * post-renderer.ts (サーバーサイド) と markdown-editor/page.tsx (クライアントサイド) で
 * 共有する Remark プラグイン群。
 * Node.js FS / path 等のサーバー依存モジュールを import しないこと。
 */
import { visit } from 'unist-util-visit';
import type { Code, Root } from 'mdast';

/**
 * コードブロックの言語指定からファイル名を分離するRemarkプラグイン。
 * 例: ```ts:filename.ts → lang="ts", meta に filename="filename.ts" を追加
 */
export function remarkExtractCodeFilename() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (node.lang?.includes(':')) {
        const colonIdx = node.lang.indexOf(':');
        const filename = node.lang.slice(colonIdx + 1);
        node.lang = node.lang.slice(0, colonIdx) || null;
        const filenameMeta = `filename="${filename}"`;
        node.meta = node.meta ? `${node.meta} ${filenameMeta}` : filenameMeta;
      }
    });
  };
}
