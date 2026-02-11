// src/components/SearchBox.tsx
'use client';

import { createPostSearcher, searchPosts } from '@/src/lib/client-search';
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
 * 記事を検索する入力UI。
 */
export default function SearchBox({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const searcher = useMemo(() => createPostSearcher(posts), [posts]);
  const results = useMemo(
    () => searchPosts(searcher, debouncedQuery).slice(0, 8),
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
          results.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/posts/${post.slug}`} className="hover:underline">
                {post.title} <span className="text-sm text-gray-500">[{post.category}]</span>
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
