import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { generateToc } from './toc';

const postsDir = path.join(process.cwd(), 'md');

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type Post = {
  slug: string;
  title: string;
  date?: Date;
  tags: string[];
  category: string;
  content: string;
  plaintext?: string;
  toc?: TocItem[];
};

/**
 * マークダウンをプレーンテキストに変換
 */
function markdownToPlaintext(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, '') // 見出し
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // インライン/ブロックコード
    .replace(/[*_~]+/g, '') // 強調記号だけ削除
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * 全記事取得（一覧用）- サーバー側のみ
 */
export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDir);

  return files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processed = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
      .use(rehypeStringify)
      .processSync(content);

    return {
      slug,
      title: data.title ?? 'No title',
      date: data.date ? new Date(data.date) : undefined,
      tags: data.tags ?? [],
      category: data.category ?? 'uncategorized',
      content: String(processed),
      plaintext: markdownToPlaintext(content),
    };
  });
}

/**
 * 単記事取得（詳細ページ用）- サーバー側のみ
 */
export async function getPost(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Markdown → HTML + 見出しID付与 + 自動リンク
  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(content);

  const htmlContent = String(processed);
  const toc = generateToc(htmlContent);

  const plaintext = markdownToPlaintext(content);

  return {
    slug,
    title: data.title ?? 'No title',
    date: data.date ? new Date(data.date) : undefined,
    tags: data.tags ?? [],
    category: data.category ?? 'uncategorized',
    content: htmlContent,
    plaintext: plaintext || '',
    toc,
  };
}
