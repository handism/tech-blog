import type { PostMeta } from '@/src/types/post';

/**
 * 投稿配列から重複なしのタグ一覧を返す。
 */
export function getAllTags(posts: PostMeta[]): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags)));
}
