// src/components/Sidebar.tsx
'use client';
import ProfileCard from '@/src/components/ProfileCard';
import TagCloud from '@/src/components/TagCloud';
import type { CategoryCount, TagCount } from '@/src/lib/post-taxonomy';
import { categoryToSlug } from '@/src/lib/utils';
import type { TocItem } from '@/src/types/post';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const SearchBox = dynamic(() => import('@/src/components/SearchBox'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-10 bg-card border border-border rounded-lg animate-pulse" />
  ),
});

/**
 * サイドバーのプロパティ。
 */
type SidebarProps = {
  toc?: TocItem[];
  categoryCounts?: CategoryCount[];
  tagCounts?: TagCount[];
};

/**
 * 記事一覧・カテゴリ・目次を表示するサイドバー。
 */
export default function Sidebar({ toc, categoryCounts, tagCounts }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasToc = !!(toc && toc.length > 0);

  const tocElements = (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-text">目次</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-text/50 hover:text-text"
        >
          ✕
        </button>
      </div>
      <ul className="space-y-2 text-sm">
        {toc?.map((item) => {
          const indent = (item.level - 1) * 16;
          return (
            <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
              <a
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className="text-text/80 hover:text-accent hover:underline block"
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <div className="space-y-6 h-full">
      <ProfileCard />
      <SearchBox />
      {/* カテゴリ一覧 */}
      {categoryCounts && categoryCounts.length > 0 && (
        <div className="p-5 border border-border/60 rounded-3xl bg-card/70 backdrop-blur-md shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-text">カテゴリ</h2>
          <ul className="space-y-2 text-sm">
            {categoryCounts.map(({ category, count }) => (
              <li key={category}>
                <Link
                  href={`/blog/categories/${categoryToSlug(category)}`}
                  className="flex justify-between items-center text-text/80 hover:text-accent hover:underline"
                >
                  <span>{category}</span>
                  <span className="ml-2 text-xs text-text/50 tabular-nums">({count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-5 border border-border/60 rounded-3xl bg-card/70 backdrop-blur-md shadow-sm">
        <h2 className="font-bold text-lg mb-4 text-text">タグ</h2>
        <TagCloud tagCounts={tagCounts ?? []} />
      </div>

      {/* --- TOC セクション --- */}
      {hasToc && (
        <>
          {/* 1. PC用 */}
          <div className="hidden lg:block sticky top-28 z-10">
            <div className="p-5 border border-border/60 rounded-3xl bg-card/70 backdrop-blur-md shadow-sm max-h-[calc(100vh-160px)] overflow-y-auto">
              {tocElements}
            </div>
          </div>

          {/* 2. スマホ用ボタン */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-text lg:hidden fixed bottom-18 right-6 z-40 w-12 h-12 bg-card border border-border rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            aria-label="目次を開く"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* 3. スマホ用オーバーレイ */}
          <div
            className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
          >
            <div
              className="bg-bg absolute inset-0 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto border-t border-border shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {tocElements}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
