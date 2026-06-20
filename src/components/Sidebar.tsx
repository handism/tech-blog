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
import { useState, useEffect, useRef } from 'react';

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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

  // モーダルオープン時のフォーカス移動とキーボード Esc キーでのクローズ
  useEffect(() => {
    if (!isOpen) return;

    // モーダルが開いた際、閉じるボタンにフォーカスを移動
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const renderTocList = (onItemClick?: () => void) => (
    <ul className="space-y-2 text-sm font-bold">
      {toc?.map((item) => {
        const indent = (item.level - 1) * 16;
        const isActive = activeId === item.id;
        return (
          <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
            <a
              href={`#${item.id}`}
              onClick={() => {
                setIsOpen(false);
                if (onItemClick) onItemClick();
              }}
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
        <>
          {/* 1. PC用 */}
          <div className="hidden lg:block sticky top-28 z-10">
            <div className="theme-card p-5 max-h-[calc(100vh-160px)] overflow-y-auto">
              <h2 className="font-extrabold text-lg mb-4 text-text">目次</h2>
              {renderTocList()}
            </div>
          </div>

          {/* 2. スマホ用ボタン */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-text lg:!hidden fixed bottom-18 right-6 z-40 w-12 h-12 theme-btn flex items-center justify-center"
            aria-label="目次を開く"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* 3. スマホ用オーバーレイ */}
          <div
            className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
            role="dialog"
            aria-modal="true"
            aria-label="目次モーダル"
            aria-hidden={!isOpen}
          >
            <div
              className="bg-bg absolute inset-0 backdrop-blur-sm opacity-50"
              onClick={() => setIsOpen(false)}
            />
            <div
              className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto border-t-3 border-border shadow-2xl transition-transform duration-300 ease-out theme-toc-drawer ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-extrabold text-lg text-text">目次</h2>
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-text/50 hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                  aria-label="目次を閉じる"
                >
                  ✕
                </button>
              </div>
              {renderTocList()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
