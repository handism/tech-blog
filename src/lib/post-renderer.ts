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
import { unified } from 'unified';
import { imageSizeFromFile } from 'image-size/fromFile';
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';
import path from 'path';
import fs from 'fs/promises';

type RenderedPost = {
  html: string;
  toc: TocItem[];
};

type ShikiOptions = { meta?: { __raw?: string }; lang?: string };

/**
 * コードブロックの言語指定からファイル名を分離するRemarkプラグイン。
 * 例: ```ts:filename.ts → lang="ts", meta に filename="filename.ts" を追加
 */
function remarkExtractCodeFilename() {
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

      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) return; // 外部・データURLはスキップ

      // 画像の候補パスを特定
      const filePaths: string[] = [];
      if (src.startsWith('/')) {
        filePaths.push(path.join(process.cwd(), 'public', src));
      } else {
        filePaths.push(path.join(process.cwd(), 'public', src.replace(/^(\.\.\/)+public\//, '')));
      }

      tasks.push(
        (async () => {
          let foundPath = '';
          for (const fp of filePaths) {
            try {
              await fs.access(fp);
              foundPath = fp;
              break;
            } catch {
              // 存在しない場合は次を試す
            }
          }

          if (!foundPath) return;

          try {
            const dimensions = await imageSizeFromFile(foundPath);
            if (dimensions.width && dimensions.height) {
              node.properties.width = dimensions.width;
              node.properties.height = dimensions.height;

              // アスペクト比を維持しつつレスポンシブ対応するためのスタイル
              node.properties.style = `max-width: 100%; height: auto; ${node.properties.style || ''}`;
            }
          } catch (e) {
            console.warn(`Failed to get size for image: ${foundPath}`, e);
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
 * Markdownレンダリング用プロセッサを作成する。
 * 各実行ごとに独立したプロセッサインスタンスを生成し、並行処理時の競合を防ぐ。
 * TOC は VFile の data フィールド経由で受け渡す。
 */
function createProcessor() {
  return unified()
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
}

/**
 * Markdown本文をHTMLとTOCへ変換する。
 */
export async function renderPostMarkdown(content: string): Promise<RenderedPost> {
  const processor = createProcessor();
  const result = await processor.process(content);
  const toc = (result.data as { toc?: TocItem[] }).toc ?? [];

  return {
    html: String(result),
    toc,
  };
}
