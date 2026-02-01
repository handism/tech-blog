'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/posts';

export default function SearchBox({ posts }: { posts: Post[] }) {
  const [q, setQ] = useState('');

  const filtered = posts.filter(
    (p: Post) => typeof p.title === 'string' && p.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <input
        className="w-full p-2 border border-border rounded bg-bg text-text placeholder:text-text/50"
        placeholder="Search..."
        onChange={(e) => setQ(e.target.value)}
      />
      {q &&
        filtered.map((p: Post) => (
          <Link key={p.slug} href={`/blog/posts/${p.slug}`}>
            <div className="text-sm text-text hover:underline">{p.title}</div>
          </Link>
        ))}
    </div>
  );
}
