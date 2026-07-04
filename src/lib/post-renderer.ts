// src/lib/post-renderer.ts
import { generateTocFromHast } from '@/src/lib/toc';
import { remarkExtractCodeFilename } from '@/src/lib/remark-plugins';
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
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkCjkFriendlyGfmStrikethrough from 'remark-cjk-friendly-gfm-strikethrough';
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

// 画像サイズ情報のキャッシュ用 Map
const imageSizeCache = new Map<string, { width: number; height: number }>();

/**
 * Markdown 本文中の画像に対して、ビルド時にファイルの
 * 実寸を読み取り width / height / loading 属性を自動付与する Rehype プラブイン。
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
            // まずキャッシュをチェック
            const cached = imageSizeCache.get(foundPath);
            if (cached) {
              node.properties.width = cached.width;
              node.properties.height = cached.height;
              node.properties.style = `max-width: 100%; height: auto; ${node.properties.style || ''}`;
            } else {
              const dimensions = await imageSizeFromFile(foundPath);
              if (dimensions.width && dimensions.height) {
                node.properties.width = dimensions.width;
                node.properties.height = dimensions.height;
                node.properties.style = `max-width: 100%; height: auto; ${node.properties.style || ''}`;

                // キャッシュに保存
                imageSizeCache.set(foundPath, {
                  width: dimensions.width,
                  height: dimensions.height,
                });
              }
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
 * Table要素を div.table-wrapper でラップする Rehype プラグイン。
 */
function rehypeTableWrapper() {
  return (tree: HastRoot) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table') return;
      if (!parent || typeof index !== 'number') return;

      // すでにラッパーが存在する場合はスキップ
      if (
        parent.type === 'element' &&
        parent.tagName === 'div' &&
        (parent.properties?.className as string[] | undefined)?.includes('table-wrapper')
      ) {
        return;
      }

      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['table-wrapper'],
        },
        children: [node],
      };

      parent.children[index] = wrapper;
    });
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
    .use(remarkCjkFriendly)
    .use(remarkCjkFriendlyGfmStrikethrough)
    .use(remarkExtractCodeFilename)
    .use(remarkMermaid)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeImageSize)
    .use(rehypeTableWrapper)
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
