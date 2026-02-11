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
 * Markdown本文をHTMLとTOCへ変換する。
 */
export async function renderPostMarkdown(content: string): Promise<RenderedPost> {
  let toc: TocItem[] = [];

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'github-dark',
      transformers: [
        {
          name: 'add-language-title',
          pre(node) {
            const lang = this.options.lang;
            if (!lang) return;
            node.properties['data-language'] = lang;
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
