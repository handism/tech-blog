// src/components/SearchBox.tsx
'use client';

import { createPostSearcher, searchPostsWithMatches } from '@/src/lib/client-search';
import { preloadTokenizer, tokenizeForSearch } from '@/src/lib/kuromoji-tokenizer';
import type { RangeTuple } from 'fuse.js';
import type { PostMeta } from '@/src/types/post';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [tokenizedQuery, setTokenizedQuery] = useState('');
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

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

  useEffect(() => {
    const idleCallback =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 1000);

    let cancelled = false;
    idleCallback(() => {
      if (cancelled) return;
      preloadTokenizer();
      if (posts.length > 0 || isLoading) return;

      fetch('/search.json')
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setPosts(data);
        })
        .catch((e) => {
          console.error('Failed to pre-fetch search index:', e);
        });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searcher = useMemo(() => createPostSearcher(posts), [posts]);
  const results = useMemo(
    () => searchPostsWithMatches(searcher, tokenizedQuery),
    [searcher, tokenizedQuery]
  );

  const hasResults = debouncedQuery.length > 0 && results.length > 0;
  const showResultsContainer = debouncedQuery.length > 0;

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query);
      setSelectedIndex(-1);
    }, 100);

    return () => window.clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      Promise.resolve().then(() => {
        setTokenizedQuery('');
      });
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (results.length === 0) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setQuery('');
        e.currentTarget.blur();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        const selectedPost = results[selectedIndex].post;
        router.push(`/blog/posts/${selectedPost.slug}`);
        setQuery('');
        e.currentTarget.blur();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      e.currentTarget.blur();
    }
  };

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
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={hasResults}
        aria-autocomplete="list"
        aria-controls="search-results-list"
        aria-activedescendant={
          selectedIndex >= 0 ? `search-result-item-${selectedIndex}` : undefined
        }
        className="w-full border-2 border-border bg-card text-text placeholder:text-text/50 py-2.5 px-4 rounded-xl shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all font-bold"
      />
      {showResultsContainer && (
        <ul
          id="search-results-list"
          role="listbox"
          aria-label="検索結果候補"
          className="mt-2 space-y-1 bg-card border-2 border-border rounded-xl p-4 shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)]"
        >
          {hasResults &&
            results.map(
              (
                { post, titleIndices, snippet, snippetIndices, matchedTags, categoryIndices },
                index
              ) => (
                <li
                  key={post.slug}
                  id={`search-result-item-${index}`}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`border-b border-border/20 last:border-b-0 py-1.5 first:pt-0 last:pb-0 px-2 rounded-lg transition-colors ${
                    selectedIndex === index ? 'bg-secondary' : ''
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Link href={`/blog/posts/${post.slug}`} className="hover:underline block">
                    <span className="font-bold">{highlightText(post.title, titleIndices)}</span>{' '}
                    <span className="text-xs text-text/60 font-semibold">
                      [{highlightText(post.category, categoryIndices)}]
                    </span>
                    {matchedTags.length > 0 && (
                      <span className="block text-xs text-text/60 mt-0.5 font-bold">
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
            <li role="option" aria-selected={false} className="text-sm text-text/60 p-2">
              検索結果が見つかりませんでした。
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
