// src/components/SearchBox.tsx
'use client';

import type { Post } from '@/src/types/post';
import Fuse from 'fuse.js';
import { useState, useMemo } from 'react';

/**
 * 検索ボックスのプロパティ。
 */
type Props = {
  posts: Post[];
};

/**
 * 記事を検索する入力UI。
 */
export default function SearchBox({ posts }: Props) {
  const [query, setQuery] = useState('');

  // Fuse.js 設定
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'plaintext', weight: 0.3 },
          { name: 'tags', weight: 0.5 },
          { name: 'category', weight: 0.5 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [posts]
  );

  const results = query ? fuse.search(query).map((r) => r.item) : [];

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <ul className="mt-2 space-y-1">
        {query &&
          results.map((post) => (
            <li key={post.slug}>
              <a href={`/blog/posts/${post.slug}`} className="hover:underline">
                {post.title} <span className="text-sm text-gray-500">[{post.category}]</span>
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}
