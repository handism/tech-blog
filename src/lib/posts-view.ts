// src/lib/posts-view.ts
import { getAllPostMeta, toPostSummary } from '@/src/lib/posts-server';
import {
  getCategoriesWithCount,
  getTagsWithCount,
  type CategoryCount,
  type TagCount,
} from '@/src/lib/post-taxonomy';
import type { PostSummary } from '@/src/types/post';

type PaginatedPosts = {
  posts: PostSummary[];
  totalPages: number;
};

type BlogViewContext = {
  allPosts: PostSummary[];
  categories: string[];
  categoryCounts: CategoryCount[];
  tagCounts: TagCount[];
};

/**
 * 一覧ページ共通で使う投稿データとカテゴリ一覧を返す。
 */
export async function getBlogViewContext(): Promise<BlogViewContext> {
  const allPosts = await getAllPostMeta();
  const categoryCounts = getCategoriesWithCount(allPosts);
  const categories = categoryCounts.map((c) => c.category);
  const tagCounts = getTagsWithCount(allPosts);

  // クライアントに渡すデータは PostSummary へ変換して軽量化。
  // plaintext・keywords は一覧表示では不要で、特に keywords は記事全文相当のため RSC ペイロードを肥大化させる。
  const lightPosts = allPosts.map(toPostSummary);

  return { allPosts: lightPosts, categories, categoryCounts, tagCounts };
}

/**
 * 投稿配列をページ番号単位で切り出す。
 */
export function paginatePosts(posts: PostSummary[], page: number, perPage: number): PaginatedPosts {
  const totalPages = Math.ceil(posts.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages,
  };
}
