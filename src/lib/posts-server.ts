// src/lib/posts-server.ts
import { createPostMeta, parsePostSource } from '@/src/lib/post-parser';
import { readAllPostSources, readPostSourceBySlug } from '@/src/lib/post-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { Post, PostMeta, PostSummary } from '@/src/types/post';
import { processMetadataList } from '@/src/lib/server-utils';
import { cache } from 'react';

/**
 * クライアントへ渡すため、サーバー／検索専用フィールド（plaintext / keywords）を除いた
 * 軽量メタ（PostSummary）へ変換する。一覧・カード表示へ渡すデータはこの関数を通す。
 */
export function toPostSummary({
  plaintext: _plaintext,
  keywords: _keywords,
  ...rest
}: PostMeta): PostSummary {
  return rest;
}

/**
 * 全記事のメタ情報を生成する（下書き除外・日付降順）。
 * 本文のプレーンテキスト化・検索用トークナイズを伴うため、記事数に比例して重い。
 */
async function loadAllPostMeta(): Promise<PostMeta[]> {
  const sources = await readAllPostSources();
  return await processMetadataList(sources, async (slug, raw) => {
    const { data, content } = parsePostSource(raw);
    return await createPostMeta(slug, data, content);
  });
}

/**
 * 本番ビルド時のプロセス内キャッシュ。
 * React の `cache()` はレンダリング（ページ）単位でしか効かないため、SSG で全記事ページを生成すると
 * ページごとに全記事の解析が走り O(記事数²) になる。ビルド中は記事ファイルが変わらないので
 * プロセス内で 1 度だけ解析して使い回す。開発環境ではファイル変更を反映するためキャッシュしない。
 */
let allPostMetaPromise: Promise<PostMeta[]> | null = null;

/**
 * 全記事のメタ情報を取得（一覧用）。
 */
export const getAllPostMeta = cache(async function getAllPostMeta(): Promise<PostMeta[]> {
  if (process.env.NODE_ENV !== 'production') return loadAllPostMeta();

  allPostMetaPromise ??= loadAllPostMeta().catch((error: unknown) => {
    allPostMetaPromise = null;
    throw error;
  });
  return allPostMetaPromise;
});

/**
 * 単記事のメタ情報のみを取得（メタデータ生成用）。
 * 全記事メタ（キャッシュ済み）から引くため、記事単体の再解析は行わない。
 * 本番環境では下書き記事は null を返す。
 */
export const getPostMetaBySlug = cache(async function getPostMetaBySlug(
  slug: string
): Promise<PostMeta | null> {
  const posts = await getAllPostMeta();
  return posts.find((p) => p.slug === slug) ?? null;
});

/**
 * 単記事取得（詳細ページ用）- サーバー側のみ
 * メタ情報は全記事メタから引き、本文 HTML のレンダリングのみ行う。
 * 本番ビルド時は draft: true の記事は全記事メタに含まれないため null を返す。
 */
export const getPost = cache(async function getPost(slug: string): Promise<Post | null> {
  const meta = await getPostMetaBySlug(slug);
  if (!meta) return null;

  const source = await readPostSourceBySlug(slug);
  if (!source) return null;

  const { content } = parsePostSource(source.raw);
  const { html: htmlContent, toc } = await renderPostMarkdown(content);

  return {
    ...meta,
    content: htmlContent,
    toc,
  };
});

/**
 * 指定スラッグに関連する記事を最大3件取得する。
 * スコア = タグ一致数 × 2 + カテゴリ一致 × 1
 */
export const getRelatedPosts = cache(async function getRelatedPosts(
  slug: string
): Promise<PostSummary[]> {
  const posts = await getAllPostMeta();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  const currentTags = new Set(current.tags);

  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const tagOverlap = p.tags.filter((t) => currentTags.has(t)).length;
      const categoryMatch = p.category === current.category ? 1 : 0;
      return { post: p, score: tagOverlap * 2 + categoryMatch };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) => b.score - a.score || (b.post.date?.getTime() ?? 0) - (a.post.date?.getTime() ?? 0)
    )
    .slice(0, 3)
    .map(({ post }) => toPostSummary(post));
});

/**
 * 指定スラッグの前後の記事を取得する。
 */
export const getAdjacentPosts = cache(async function getAdjacentPosts(
  slug: string
): Promise<{ prevPost: PostSummary | null; nextPost: PostSummary | null }> {
  const posts = await getAllPostMeta();
  const slugToIndex = new Map(posts.map((p, i) => [p.slug, i]));
  const currentIndex = slugToIndex.get(slug) ?? -1;
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }
  return {
    prevPost: currentIndex < posts.length - 1 ? toPostSummary(posts[currentIndex + 1]) : null,
    nextPost: currentIndex > 0 ? toPostSummary(posts[currentIndex - 1]) : null,
  };
});
