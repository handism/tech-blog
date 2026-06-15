// src/components/SearchBox.tsx
'use client';

import { createPostSearcher, searchPostsWithMatches } from '@/src/lib/client-search';
import { preloadTokenizer, tokenizeForSearch } from '@/src/lib/kuromoji-tokenizer';
import type { RangeTuple } from 'fuse.js';
import type { PostMeta } from '@/src/types/post';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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
      <mark
        key={`${start}-${end}`}
        className="bg-accent/30 dark:bg-accent/40 text-inherit rounded-sm px-0.5"
      >
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
export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tokenizedQuery, setTokenizedQuery] = useState('');
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFocus = async () => {
    preloadTokenizer();
    if (posts.length > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/search.json');
      const data = await res.json();
      setPosts(data);
    } catch (e) {
      console.error('Failed to fetch search index:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const searcher = useMemo(() => createPostSearcher(posts), [posts]);
  const results = useMemo(
    () => searchPostsWithMatches(searcher, tokenizedQuery),
    [searcher, tokenizedQuery]
  );

  const hasResults = debouncedQuery.length > 0 && results.length > 0;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 100);

    return () => window.clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setTokenizedQuery('');
      return;
    }
    let cancelled = false;
    tokenizeForSearch(debouncedQuery).then((result) => {
      if (!cancelled) setTokenizedQuery(result);
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="space-y-2">
      <label htmlFor="site-search" className="sr-only">
        記事検索
      </label>
      <input
        id="site-search"
        name="q"
        type="text"
        placeholder={isLoading ? '読込中...' : '検索...'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        onMouseEnter={handleFocus}
        className="w-full border border-border/60 bg-card/60 backdrop-blur-md text-text placeholder:text-text/40 py-2.5 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-inner transition-all"
      />
      <ul
        className={`mt-2 space-y-1 ${hasResults ? 'bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-4 shadow-xl' : ''}`}
      >
        {hasResults &&
          results.map(
            ({ post, titleIndices, snippet, snippetIndices, matchedTags, categoryIndices }) => (
              <li key={post.slug}>
                <Link href={`/blog/posts/${post.slug}`} className="hover:underline block">
                  <span>{highlightText(post.title, titleIndices)}</span>{' '}
                  <span className="text-sm text-text/60">
                    [{highlightText(post.category, categoryIndices)}]
                  </span>
                  {matchedTags.length > 0 && (
                    <span className="block text-xs text-text/60 mt-0.5">
                      {matchedTags.map(({ tag, indices }, i) => (
                        <span key={i} className="mr-1">
                          #{highlightText(tag, indices)}
                        </span>
                      ))}
                    </span>
                  )}
                  {snippet && (
                    <span className="block text-xs text-text/60 mt-0.5 line-clamp-1">
                      {highlightText(snippet, snippetIndices)}
                    </span>
                  )}
                </Link>
              </li>
            )
          )}
        {debouncedQuery && results.length === 0 && (
          <li className="text-sm text-text/60">検索結果が見つかりませんでした。</li>
        )}
      </ul>
    </div>
  );
}
