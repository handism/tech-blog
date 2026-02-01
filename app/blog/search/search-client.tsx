'use client';

import { useState, useMemo } from 'react';
import { searchPosts } from '@/lib/client-search';
import BlogLayout from '@/components/BlogLayout';
import type { Post } from '@/lib/posts';

// SSG: ビルド時にサーバーから受け取られた記事データ
interface SearchPageProps {
  posts: Post[];
  categories: string[];
}

export default function SearchPage({ posts, categories }: SearchPageProps) {
  const [keyword, setKeyword] = useState('');

  const results = useMemo(() => {
    if (!keyword.trim()) return [];
    return searchPosts(posts, keyword);
  }, [keyword, posts]);

  return (
    <BlogLayout posts={posts} categories={categories}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-6">検索</h1>
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="検索ワードを入力"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 border border-border rounded px-3 py-2 bg-card text-text"
          />
        </div>

        {keyword && <p className="text-text/70 mb-4">{results.length} 件の記事が見つかりました</p>}

        <ul className="space-y-2">
          {results.map((post: Post) => (
            <li key={post.slug} className="border-l-4 border-border pl-4 py-2">
              <a
                href={`/blog/posts/${post.slug}`}
                className="text-lg font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {post.title}
              </a>
              <p className="text-text/70 text-sm">
                {post.category && `[${post.category}]`}
                {post.tags.length > 0 && ` ${post.tags.join(', ')}`}
              </p>
            </li>
          ))}
        </ul>

        {keyword && results.length === 0 && (
          <p className="text-center text-text/50 py-8">「{keyword}」に一致する記事はありません</p>
        )}
      </div>
    </BlogLayout>
  );
}
