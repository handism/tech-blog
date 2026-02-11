// src/lib/client-search.ts
/**
 * クライアント側検索機能（SSG/Static Export 対応）
 * ビルド時にすべての記事データが埋め込まれる
 */
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import type { Post } from '@/src/types/post';

/**
 * 記事検索時に使うFuse.js設定。
 */
const postSearchOptions: IFuseOptions<Post> = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'plaintext', weight: 0.3 },
    { name: 'tags', weight: 0.5 },
    { name: 'category', weight: 0.5 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * 記事配列から検索インデックスを生成する。
 */
export function createPostSearcher(posts: Post[]): Fuse<Post> {
  return new Fuse(posts, postSearchOptions);
}

/**
 * 生成済みの検索インデックスで記事を検索する。
 */
export function searchPosts(searcher: Fuse<Post>, keyword: string): Post[] {
  if (!keyword.trim()) return [];

  return searcher.search(keyword).map((result) => result.item);
}
