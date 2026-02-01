import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
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
  toc?: TocItem[];
};

/**
 * 全記事取得（一覧用）- サーバー側のみ
 */
export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDir);

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? 'No title',
      date: data.date ? new Date(data.date) : undefined,
      tags: data.tags ?? [],
      category: data.category ?? 'uncategorized',
      content,
    };
  });

  return posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processed = await (remark() as any)
    .use(remarkSlug)
    .use(remarkAutolinkHeadings, { behavior: 'wrap' })
    .use(remarkHtml)
    .process(content);

  const toc = generateToc(String(processed.value || processed));

  return {
    slug,
    title: data.title ?? 'No title',
    date: data.date ? new Date(data.date) : undefined,
    tags: data.tags ?? [],
    category: data.category ?? 'uncategorized',
    content: String(processed.value || processed),
    toc,
  };
}
