// src/components/Sidebar.tsx
'use client';
import ProfileCard from '@/src/components/ProfileCard';
import TagCloud from '@/src/components/TagCloud';
import type { CategoryCount, TagCount } from '@/src/lib/post-taxonomy';
import { categoryToSlug } from '@/src/lib/utils';
import type { TocItem } from '@/src/types/post';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const hasToc = !!(toc && toc.length > 0);

  // IntersectionObserverによるTOCのハイライト
  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -70% 0px',
      }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  const renderTocList = () => (
    <ul className="space-y-2 text-sm font-bold">
      {toc?.map((item) => {
        const indent = (item.level - 1) * 16;
        const isActive = activeId === item.id;
        return (
          <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
            <a
              href={`#${item.id}`}
              className={`block hover:text-accent hover:underline transition-all duration-200 ${
                isActive ? 'text-accent font-extrabold translate-x-1' : 'text-text/80 font-medium'
              }`}
            >
              {isActive && <span className="inline-block mr-1.5 text-accent animate-pulse">●</span>}
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="space-y-6 h-full">
      <ProfileCard />
      <SearchBox />
      {/* カテゴリ一覧 */}
      {categoryCounts && categoryCounts.length > 0 && (
        <div className="theme-card p-5">
          <h2 className="font-extrabold text-lg mb-4 text-text">カテゴリ</h2>
          <ul className="space-y-2 text-sm font-bold">
            {categoryCounts.map(({ category, count }) => (
              <li key={category}>
                <Link
                  href={`/blog/categories/${categoryToSlug(category)}`}
                  className="flex justify-between items-center text-text/80 hover:text-accent hover:translate-x-1 transition-all duration-200"
                >
                  <span>{category}</span>
                  <span className="ml-2 text-xs text-text/50 tabular-nums border border-border px-1.5 py-0.5 rounded-md bg-secondary">
                    ({count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="theme-card p-5">
        <h2 className="font-extrabold text-lg mb-4 text-text">タグ</h2>
        <TagCloud tagCounts={tagCounts ?? []} />
      </div>

      {/* --- TOC セクション --- */}
      {hasToc && (
        <div className="hidden lg:block sticky top-28 z-10">
          <div className="theme-card p-5 max-h-[calc(100vh-160px)] overflow-y-auto">
            <h2 className="font-extrabold text-lg mb-4 text-text">目次</h2>
            {renderTocList()}
          </div>
        </div>
      )}
    </div>
  );
}
