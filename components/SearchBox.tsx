'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { searchPosts } from '@/lib/client-search';
import type { Post } from '@/lib/posts';

export default function SearchBox({ posts }: { posts: (Post & { plaintext: string })[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    return searchPosts(posts, q);
  }, [q, posts]);

  return (
    <div className="relative">
      <input
        className="w-full p-2 border border-border rounded bg-bg text-text placeholder:text-text/50"
        placeholder="記事を検索..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {q && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10 max-h-64 overflow-y-auto">
          {filtered.map((p) => (
            <Link key={p.slug} href={`/blog/posts/${p.slug}`}>
              <div className="p-2 border-b border-border last:border-b-0 hover:bg-bg text-sm cursor-pointer">
                <div className="font-medium text-text">{p.title}</div>
                <div className="text-text/60 text-xs">{p.category}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
