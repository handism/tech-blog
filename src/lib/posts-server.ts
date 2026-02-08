// src/lib/posts-server.ts
import { siteConfig } from '@/src/config/site';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { generateToc } from '@/src/lib/toc';
import rehypeShiki from '@shikijs/rehype';

const postsDir = path.join(process.cwd(), siteConfig.posts.dir);

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
  image?: string; // 追加
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
 * 全記事取得（一覧用）- 非同期に変更
 */
export async function getAllPosts(): Promise<Post[]> {
  const files = fs.readdirSync(postsDir, { withFileTypes: true });

  // mapの中で await を使うため、Promiseの配列を作成
  const postPromises = files
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(async (file) => {
      const slug = file.name.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, file.name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // processSync ではなく process を使い、await する
      const processed = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeShiki, {
          theme: 'github-dark',
        })
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
        .use(rehypeStringify)
        .process(content);

      return {
        slug,
        title: data.title ?? siteConfig.posts.defaultTitle,
        date: data.date ? new Date(data.date) : undefined,
        tags: data.tags ?? [],
        category: data.category ?? siteConfig.posts.defaultCategory,
        content: String(processed),
        plaintext: markdownToPlaintext(content),
        image: data.image,
      };
    });

  // 全てのPromiseが解決するのを待つ
  const posts = await Promise.all(postPromises);

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
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeShiki, {
      theme: 'github-dark', // または 'tokyo-night', 'vitesse-dark' など
    })
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(content);

  const htmlContent = String(processed);
  const toc = generateToc(htmlContent);

  const plaintext = markdownToPlaintext(content);

  return {
    slug,
    title: data.title ?? siteConfig.posts.defaultTitle,
    date: data.date ? new Date(data.date) : undefined,
    tags: data.tags ?? [],
    category: data.category ?? siteConfig.posts.defaultCategory,
    content: htmlContent,
    plaintext: plaintext || '',
    toc,
    image: data.image,
  };
}
