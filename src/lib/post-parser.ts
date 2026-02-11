// src/lib/post-parser.ts
import { siteConfig } from '@/src/config/site';
import type { PostMeta } from '@/src/types/post';
import matter from 'gray-matter';

type Frontmatter = Record<string, unknown>;

type ParsedPostSource = {
  data: Frontmatter;
  content: string;
};

/**
 * Markdown文字列をfrontmatterと本文に分解する。
 */
export function parsePostSource(raw: string): ParsedPostSource {
  const { data, content } = matter(raw);
  return {
    data: data as Frontmatter,
    content,
  };
}

/**
 * マークダウン本文をプレーンテキストに変換する。
 */
function markdownToPlaintext(markdown: string): string {
  return markdown
    .replace(/^#+\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}[^`]+`{1,3}/g, '')
    .replace(/[*_~]+/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

/**
 * frontmatterと本文から一覧向けメタ情報を生成する。
 */
export function createPostMeta(slug: string, data: Frontmatter, content: string): PostMeta {
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
