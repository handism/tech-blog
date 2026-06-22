// src/lib/post-renderer.ts
import { generateTocFromHast } from '@/src/lib/toc';
import type { TocItem } from '@/src/types/post';
import rehypeShiki from '@shikijs/rehype';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import type { Code, Root, HTML } from 'mdast';
import type { Root as HastRoot } from 'hast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import type { Node } from 'unist';
import { unified } from 'unified';
import { imageSizeFromFile } from 'image-size/fromFile';
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';
import path from 'path';
import fs from 'fs';

type RenderedPost = {
  html: string;
  toc: TocItem[];
};

type ShikiOptions = { meta?: { __raw?: string }; lang?: string };

/**
 * Node が Code 型であるか判定する型ガード。
 */
function isCodeNode(node: Node): node is Code {
  return node.type === 'code';
}

/**
 * コードブロックの言語指定からファイル名を分離するRemarkプラグイン。
 * 例: ```ts:filename.ts → lang="ts", meta に filename="filename.ts" を追加
 */
function remarkExtractCodeFilename() {
  return (tree: Root) => {
    function walk(node: Node) {
      if (isCodeNode(node)) {
        if (node.lang?.includes(':')) {
          const colonIdx = node.lang.indexOf(':');
          const filename = node.lang.slice(colonIdx + 1);
          node.lang = node.lang.slice(0, colonIdx) || null;
          const filenameMeta = `filename="${filename}"`;
          node.meta = node.meta ? `${node.meta} ${filenameMeta}` : filenameMeta;
        }
      }
      if ('children' in node) {
        (node as { children: Node[] }).children.forEach(walk);
      }
    }
    walk(tree);
  };
}

/**
 * Mermaidのコードブロックを検出し、Shikiをバイパスして
 * 生の <div class="mermaid"> に置換する Remark プラグイン。
 */
function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index, parent) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        const htmlNode: HTML = {
          type: 'html',
          value: `<div class="mermaid">${node.value}</div>`,
        };
        parent.children[index] = htmlNode;
      }
    });
  };
}

/**
 * Markdown 本文中の画像に対して、ビルド時にファイルの
 * 実寸を読み取り width / height / loading 属性を自動付与する Rehype プラグイン。
 * これにより、静的エクスポート環境でも CLS（レイアウトシフト）を防止できる。
 */
function rehypeImageSize() {
  return async (tree: HastRoot) => {
    const tasks: Promise<void>[] = [];

    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img') return;

      const src = node.properties?.src;
      if (typeof src !== 'string') return;

      // 画像パスの特定
      let filePath = '';
      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) return; // 外部・データURLはスキップ

      if (src.startsWith('/')) {
        // ルート相対パス（/images/... など）
        filePath = path.join(process.cwd(), 'public', src);
      } else {
        // 相対パス（../../public/... など）
        // まずは public ディレクトリを基準に解決を試みる
        const resolvedPath = path.join(
          process.cwd(),
          'public',
          src.replace(/^(\.\.\/)+public\//, '')
        );
        if (fs.existsSync(resolvedPath)) {
          filePath = resolvedPath;
        }
      }

      if (!filePath || !fs.existsSync(filePath)) return;

      tasks.push(
        (async () => {
          try {
            const dimensions = await imageSizeFromFile(filePath);
            if (dimensions.width && dimensions.height) {
              node.properties.width = dimensions.width;
              node.properties.height = dimensions.height;

              // アスペクト比を維持しつつレスポンシブ対応するためのスタイル（Next.js の Image に擬似的に近づける）
              node.properties.style = `max-width: 100%; height: auto; ${node.properties.style || ''}`;
            }
          } catch (e) {
            console.warn(`Failed to get size for image: ${filePath}`, e);
          }
          // 遅延読み込みを設定
          if (!node.properties.loading) {
            node.properties.loading = 'lazy';
          }
        })()
      );
    });

    await Promise.all(tasks);
  };
}

/**
 * Markdownレンダリング用プロセッサ（モジュールレベルでシングルトン化）。
 * TOC は VFile の data フィールド経由で受け渡す。
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkExtractCodeFilename)
  .use(remarkMermaid)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeImageSize)
  .use(rehypeShiki, {
    theme: 'github-dark',
    transformers: [
      {
        name: 'add-language-title',
        pre(node) {
          const lang = this.options.lang;
          if (lang) node.properties['data-language'] = lang;
          const rawMeta = (this.options as ShikiOptions).meta?.__raw ?? '';
          const filenameMatch = rawMeta.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            node.properties['data-filename'] = filenameMatch[1];
          }
        },
      },
    ],
  })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
  .use(() => (tree, file) => {
    (file.data as { toc?: TocItem[] }).toc = generateTocFromHast(tree);
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

/**
 * Markdown本文をHTMLとTOCへ変換する。
 */
export async function renderPostMarkdown(content: string): Promise<RenderedPost> {
  const result = await processor.process(content);
  const toc = (result.data as { toc?: TocItem[] }).toc ?? [];

  return {
    html: String(result),
    toc,
  };
}
