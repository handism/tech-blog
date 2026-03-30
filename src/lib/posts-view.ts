// src/lib/posts-view.ts
import { getAllPostMeta } from '@/src/lib/posts-server';
import { getTagsWithCount } from '@/src/lib/post-taxonomy';
import type { PostMeta } from '@/src/types/post';

type PaginatedPosts = {
  posts: PostMeta[];
  totalPages: number;
};

export type TagCount = {
  tag: string;
  count: number;
};

type BlogViewContext = {
  allPosts: PostMeta[];
  categories: string[];
  tagCounts: TagCount[];
};

/**
 * 一覧ページ共通で使う投稿データとカテゴリ一覧を返す。
 */
export async function getBlogViewContext(): Promise<BlogViewContext> {
  const allPosts = await getAllPostMeta();
  const categories = Array.from(new Set(allPosts.map((post) => post.category))).sort();
  const tagCounts = getTagsWithCount(allPosts);

  // クライアントに渡すデータから plaintext を除去して軽量化
  const lightPosts = allPosts.map(({ plaintext: _plaintext, ...rest }) => rest) as PostMeta[];

  return { allPosts: lightPosts, categories, tagCounts };
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
