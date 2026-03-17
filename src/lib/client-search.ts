// src/lib/client-search.ts
/**
 * クライアント側検索機能（SSG/Static Export 対応）
 * ビルド時にすべての記事データが埋め込まれる
 */
import Fuse from 'fuse.js';
import type { FuseResult, IFuseOptions, RangeTuple } from 'fuse.js';
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
  includeMatches: true,
};

/**
 * 検索結果にマッチ情報を付加した型。
 */
export type SearchResult = {
  post: PostMeta;
  titleIndices: readonly RangeTuple[];
  snippet: string | undefined;
  snippetIndices: readonly RangeTuple[];
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

/**
 * マッチ位置情報付きで記事を検索する。
 * タイトルのハイライトと本文スニペットを返す。
 */
export function searchPostsWithMatches(
  searcher: Fuse<PostMeta>,
  keyword: string
): SearchResult[] {
  if (!keyword.trim()) return [];

  return (searcher.search(keyword) as FuseResult<PostMeta>[])
    .slice(0, 8)
    .map((result) => {
      const titleMatch = result.matches?.find((m) => m.key === 'title');
      const textMatch = result.matches?.find((m) => m.key === 'plaintext');

      let snippet: string | undefined;
      let snippetIndices: readonly RangeTuple[] = [];

      if (textMatch && textMatch.indices.length > 0) {
        const plaintext = result.item.plaintext ?? '';
        const [start] = textMatch.indices[0];
        const from = Math.max(0, start - 30);
        const to = Math.min(plaintext.length, from + 100);
        // from > 0 のとき先頭に「…」(1文字) を付与するため、元インデックスを 1 だけオフセットする
        const offset = from > 0 ? 1 : 0;
        snippet = (from > 0 ? '…' : '') + plaintext.slice(from, to);
        snippetIndices = textMatch.indices
          .filter(([s, e]) => s >= from && e <= to)
          .map(([s, e]) => [s - from + offset, e - from + offset] as RangeTuple);
      }

      return {
        post: result.item,
        titleIndices: titleMatch?.indices ?? [],
        snippet,
        snippetIndices,
      };
    });
}
