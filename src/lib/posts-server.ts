// src/lib/posts-server.ts
import { createPostMeta, parsePostSource } from '@/src/lib/post-parser';
import { readAllPostSources, readPostSourceBySlug } from '@/src/lib/post-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { Post, PostMeta } from '@/src/types/post';
import { cache } from 'react';

/**
 * スラッグからソースを読み込み、メタ情報と本文を返す内部ヘルパー。
 */
async function _loadAndParseMeta(
  slug: string
): Promise<{ meta: PostMeta; content: string } | null> {
  const source = await readPostSourceBySlug(slug);
  if (!source) return null;
  const { data, content } = parsePostSource(source.raw);
  return { meta: createPostMeta(slug, data, content), content };
}

/**
 * 全記事のメタ情報を取得（一覧用）。
 */
export const getAllPostMeta = cache(async function getAllPostMeta(): Promise<PostMeta[]> {
  const sources = await readAllPostSources();
  const posts = sources.map(({ slug, raw }) => {
    const { data, content } = parsePostSource(raw);
    return createPostMeta(slug, data, content);
  });

  return posts.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
});

/**
 * 単記事のメタ情報のみを取得（メタデータ生成用）。
 */
export const getPostMetaBySlug = cache(async function getPostMetaBySlug(
  slug: string
): Promise<PostMeta | null> {
  const parsed = await _loadAndParseMeta(slug);
  return parsed?.meta ?? null;
});

/**
 * 単記事取得（詳細ページ用）- サーバー側のみ
 */
export async function getPost(slug: string): Promise<Post | null> {
  const parsed = await _loadAndParseMeta(slug);
  if (!parsed) return null;

  const { html: htmlContent, toc } = await renderPostMarkdown(parsed.content);

  return {
    ...parsed.meta,
    content: htmlContent,
    toc,
  };
}

/**
 * 指定スラッグの前後の記事を取得する。
 */
export const getAdjacentPosts = cache(async function getAdjacentPosts(
  slug: string
): Promise<{ prevPost: PostMeta | null; nextPost: PostMeta | null }> {
  const posts = await getAllPostMeta();
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  return {
    prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
    nextPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  };
});
