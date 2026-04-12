// src/lib/posts-view.ts
import { getAllPostMeta } from '@/src/lib/posts-server';
import {
  getCategoriesWithCount,
  getTagsWithCount,
  type CategoryCount,
  type TagCount,
} from '@/src/lib/post-taxonomy';
import type { PostMeta } from '@/src/types/post';

type PaginatedPosts = {
  posts: PostMeta[];
  totalPages: number;
};


type BlogViewContext = {
  allPosts: PostMeta[];
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

  // クライアントに渡すデータから plaintext を除去して軽量化
  const lightPosts = allPosts.map(({ plaintext: _plaintext, ...rest }) => rest) as PostMeta[];

  return { allPosts: lightPosts, categories, categoryCounts, tagCounts };
}

/**
 * 投稿配列をページ番号単位で切り出す。
 */
export function paginatePosts(posts: PostMeta[], page: number, perPage: number): PaginatedPosts {
  const totalPages = Math.ceil(posts.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages,
  };
}
