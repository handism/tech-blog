// src/components/SearchBox.tsx
'use client';

import { createPostSearcher, searchPostsWithMatches } from '@/src/lib/client-search';
import type { RangeTuple } from 'fuse.js';
import type { PostMeta } from '@/src/types/post';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

/**
 * 検索ボックスのプロパティ。
 */
type Props = {
  posts: PostMeta[];
};

/**
 * マッチ位置情報をもとにテキストを <mark> でハイライトした React ノード配列を返す。
 */
function highlightText(text: string, indices: readonly RangeTuple[]): React.ReactNode[] {
  if (indices.length === 0) return [text];

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const [start, end] of indices) {
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(
      <mark key={`${start}-${end}`} className="bg-accent/30 dark:bg-accent/40 text-inherit rounded-sm px-0.5">
        {text.slice(start, end + 1)}
      </mark>
    );
    cursor = end + 1;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

/**
 * 記事を検索する入力UI。
 */
export default function SearchBox({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const searcher = useMemo(() => createPostSearcher(posts), [posts]);
  const results = useMemo(
    () => searchPostsWithMatches(searcher, debouncedQuery),
    [searcher, debouncedQuery]
  );

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => window.clearTimeout(timerId);
  }, [query]);

  return (
    <div className="space-y-2">
      <label htmlFor="site-search" className="sr-only">
        記事検索
      </label>
      <input
        id="site-search"
        name="q"
        type="text"
        placeholder="検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <ul className="mt-2 space-y-1">
        {debouncedQuery &&
          results.map(({ post, titleIndices, snippet, snippetIndices }) => (
            <li key={post.slug}>
              <Link href={`/blog/posts/${post.slug}`} className="hover:underline block">
                <span>{highlightText(post.title, titleIndices)}</span>{' '}
                <span className="text-sm text-gray-500">[{post.category}]</span>
                {snippet && (
                  <span className="block text-xs text-text/60 mt-0.5 line-clamp-1">
                    {highlightText(snippet, snippetIndices)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        {debouncedQuery && results.length === 0 && (
          <li className="text-sm text-text/60">検索結果が見つかりませんでした。</li>
        )}
      </ul>
    </div>
  );
}
