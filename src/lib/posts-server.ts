// src/lib/posts-server.ts
import { siteConfig } from '@/src/config/site';
import { generateToc } from '@/src/lib/toc';
import type { Post, PostMeta } from '@/src/types/post';
import rehypeShiki from '@shikijs/rehype';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const postsDir = path.join(process.cwd(), siteConfig.posts.dir);

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
 * MarkdownをHTMLへ変換する共通処理。
 */
async function renderMarkdownToHtml(content: string): Promise<string> {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeShiki, {
      theme: 'github-dark',
      transformers: [
        {
          // Shikiの内部処理で言語名を差し込む
          name: 'add-language-title',
          pre(node) {
            // codeブロックから言語名を取得
            const lang = this.options.lang;
            if (!lang) return;

            // preタグの前にタイトルを挿入するのではなく、
            // 構造を工夫するか、CSSでpreの上に表示させます
            // ここでは簡単に、node（pre）の属性に言語名を保持させ、CSSで表示する方法が楽です
            node.properties['data-language'] = lang;
          },
        },
      ],
    })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(content);

  return String(processed);
}

/**
 * frontmatterと本文から一覧向けメタ情報を生成する。
 */
function createPostMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  return {
    slug,
    title: typeof data.title === 'string' ? data.title : siteConfig.posts.defaultTitle,
    date:
      typeof data.date === 'string' || data.date instanceof Date ? new Date(data.date) : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    category: typeof data.category === 'string' ? data.category : siteConfig.posts.defaultCategory,
    plaintext: markdownToPlaintext(content),
    image: typeof data.image === 'string' ? data.image : undefined,
  };
}

/**
 * 全記事のメタ情報を取得（一覧用）。
 */
export async function getAllPostMeta(): Promise<PostMeta[]> {
  const files = fs.readdirSync(postsDir, { withFileTypes: true });

  const posts = files
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
    .map((file) => {
      const slug = file.name.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, file.name);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return createPostMeta(slug, data as Record<string, unknown>, content);
    });

  return posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
}

/**
 * 互換用: 既存呼び出し向けに一覧メタ情報を返す。
 */
export async function getAllPosts(): Promise<PostMeta[]> {
  return getAllPostMeta();
}

/**
 * 単記事取得（詳細ページ用）- サーバー側のみ
 */
export async function getPost(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const htmlContent = await renderMarkdownToHtml(content);
  const toc = generateToc(htmlContent);
  const meta = createPostMeta(slug, data as Record<string, unknown>, content);

  return {
    ...meta,
    content: htmlContent,
    toc,
  };
}
