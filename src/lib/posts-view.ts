import { getAllPostMeta } from '@/src/lib/posts-server';
import type { PostMeta } from '@/src/types/post';

type PaginatedPosts = {
  posts: PostMeta[];
  totalPages: number;
};

type BlogViewContext = {
  allPosts: PostMeta[];
  categories: string[];
};

/**
 * 一覧ページ共通で使う投稿データとカテゴリ一覧を返す。
 */
export async function getBlogViewContext(): Promise<BlogViewContext> {
  const allPosts = await getAllPostMeta();
  const categories = Array.from(new Set(allPosts.map((post) => post.category)));
  return { allPosts, categories };
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

/**
 * 投稿配列から重複なしのタグ一覧を返す。
 */
export function getAllTags(posts: PostMeta[]): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags)));
}
