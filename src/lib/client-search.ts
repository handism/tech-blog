// src/lib/client-search.ts
/**
 * クライアント側検索機能（SSG/Static Export 対応）
 * ビルド時にすべての記事データが埋め込まれる
 */
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import type { PostMeta } from '@/src/types/post';

/**
 * 記事検索時に使うFuse.js設定。
 * ウェイトの合計を基に正規化される（title:30%, plaintext:25%, tags:25%, category:20%）。
 * threshold を 0.4 にして本文部分一致も拾えるよう調整。
 */
const postSearchOptions: IFuseOptions<PostMeta> = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'plaintext', weight: 0.5 },
    { name: 'tags', weight: 0.5 },
    { name: 'category', weight: 0.4 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * 記事配列から検索インデックスを生成する。
 */
export function createPostSearcher(posts: PostMeta[]): Fuse<PostMeta> {
  return new Fuse(posts, postSearchOptions);
}

/**
 * 生成済みの検索インデックスで記事を検索する。
 */
export function searchPosts(searcher: Fuse<PostMeta>, keyword: string): PostMeta[] {
  if (!keyword.trim()) return [];

  return searcher.search(keyword).map((result) => result.item);
}
