// src/lib/post-taxonomy.ts
import type { PostMeta } from '@/src/types/post';

export type CategoryCount = {
  category: string;
  count: number;
};

export type TagCount = {
  tag: string;
  count: number;
};


/**
 * 投稿配列から重複なしのタグ一覧を返す。
 */
export function getAllTags(posts: PostMeta[]): string[] {
  return Array.from(new Set(posts.flatMap((post) => post.tags)));
}

/**
 * 投稿配列からカテゴリと出現回数の一覧を返す（アルファベット順）。
 */
export function getCategoriesWithCount(posts: PostMeta[]): CategoryCount[] {
  const countMap = new Map<string, number>();
  for (const post of posts) {
    countMap.set(post.category, (countMap.get(post.category) ?? 0) + 1);
  }
  return Array.from(countMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * 投稿配列からタグと出現回数の一覧を返す（出現回数の多い順）。
 */
export function getTagsWithCount(posts: PostMeta[]): TagCount[] {
  const countMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(countMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
