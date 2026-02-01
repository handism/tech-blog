import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
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
    .replace(/^#+\s+/gm, '') // ヘッダーを削除
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクを削除
    .replace(/`[^`]+`/g, '') // インラインコードを削除
    .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
    .replace(/[*_~-]+/g, '') // マークダウン記号を削除
    .replace(/\n+/g, ' ') // 改行をスペースに
    .trim();
}

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
      plaintext: markdownToPlaintext(content),
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

  // Markdown → HTML + 見出しID付与 + 自動リンク
  const processed = await remark()
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(remarkHtml)
    .process(content);

  const htmlContent = String(processed.value || processed);
  const toc = generateToc(htmlContent);

  // HTML を plain text に変換して Fuse.js 用にする
  const plaintext = markdownToPlaintext(htmlContent);

  return {
    slug,
    title: data.title ?? 'No title',
    date: data.date ? new Date(data.date) : undefined,
    tags: data.tags ?? [],
    category: data.category ?? 'uncategorized',
    content: htmlContent,
    plaintext: plaintext || '', // 必ず文字列
    toc,
  };
}
