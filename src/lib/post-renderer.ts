// src/lib/post-renderer.ts
import { generateTocFromHast } from '@/src/lib/toc';
import type { TocItem } from '@/src/types/post';
import rehypeShiki from '@shikijs/rehype';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

type RenderedPost = {
  html: string;
  toc: TocItem[];
};

/**
 * コードブロックの言語指定からファイル名を分離するRemarkプラグイン。
 * 例: ```ts:filename.ts → lang="ts", meta に filename="filename.ts" を追加
 */
function remarkExtractCodeFilename() {
  return (tree: any) => {
    function walk(node: any) {
      if (node.type === 'code' && node.lang?.includes(':')) {
        const colonIdx = node.lang.indexOf(':');
        const filename = node.lang.slice(colonIdx + 1);
        node.lang = node.lang.slice(0, colonIdx) || null;
        const filenameMeta = `filename="${filename}"`;
        node.meta = node.meta ? `${node.meta} ${filenameMeta}` : filenameMeta;
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}

/**
 * Markdown本文をHTMLとTOCへ変換する。
 */
export async function renderPostMarkdown(content: string): Promise<RenderedPost> {
  let toc: TocItem[] = [];

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkExtractCodeFilename)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'github-dark',
      transformers: [
        {
          name: 'add-language-title',
          pre(node) {
            const lang = this.options.lang;
            if (lang) node.properties['data-language'] = lang;
            const rawMeta = (this.options as any).meta?.__raw ?? '';
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
    .use(() => (tree) => {
      toc = generateTocFromHast(tree);
    })
    .use(rehypeStringify)
    .process(content);

  return {
    html: String(processed),
    toc,
  };
}
