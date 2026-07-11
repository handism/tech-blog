// src/components/LearningLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { TocItem } from '@/src/types/post';
import type { LearningPostMeta, LearningCourseMeta } from '@/src/types/learning';
import { BookOpen, ChevronRight, X } from 'lucide-react';
import MobileToc from '@/src/components/MobileToc';
import TocList from '@/src/components/TocList';
import { useTocObserver } from '@/src/hooks/useTocObserver';

interface LearningLayoutProps {
  children: React.ReactNode;
  course: LearningCourseMeta;
  chapters: LearningPostMeta[];
  currentSlug: string;
  toc?: TocItem[];
}

export default function LearningLayout({
  children,
  course,
  chapters,
  currentSlug,
  toc,
}: LearningLayoutProps) {
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const activeId = useTocObserver(toc);

  const hasToc = !!(toc && toc.length > 0);

  const renderChapterList = (onItemClick?: () => void) => (
    <nav className="space-y-1">
      {chapters.map((chapter) => {
        const isActive = chapter.slug === currentSlug;
        return (
          <Link
            key={chapter.slug}
            href={`/learning/${course.id}/${chapter.slug}`}
            onClick={onItemClick}
            className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 border-2 ${
              isActive
                ? 'bg-accent border-border text-white shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)]'
                : 'text-text/80 hover:bg-secondary border-transparent hover:border-border hover:translate-x-0.5'
            }`}
          >
            <span
              className={`w-5 text-center text-xs font-black tabular-nums ${isActive ? 'text-white' : 'text-text/40'}`}
            >
              {chapter.order}
            </span>
            <span className="truncate leading-tight">{chapter.title}</span>
            {isActive && <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-white" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 md:pt-10 md:pb-24">
      {/* パンくずリスト ＆ モバイル用切り替えボタン */}
      <div className="mb-6 flex flex-col gap-4 border-b-2 border-border pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold text-text/60">
          <Link href="/learning" className="hover:text-accent transition-colors">
            学習ガイド
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/learning/${course.id}`}
            className="hover:text-accent flex items-center gap-1 transition-colors"
          >
            <span>{course.emoji}</span>
            <span>{course.title}</span>
          </Link>
        </div>

        {/* モバイル表示時のトグルボタン */}
        <div className="flex gap-2 lg:hidden">
          <button
            onClick={() => setIsChapterDrawerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-extrabold theme-btn text-text"
          >
            <BookOpen className="h-4 w-4" />
            チャプター ({chapters.length})
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr_240px] xl:grid-cols-[260px_1fr_260px]">
        {/* 1. PC用：チャプター一覧サイドバー */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            <div className="theme-card p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-border">
                <span className="text-2xl leading-none">{course.emoji}</span>
                <h2 className="font-extrabold text-base text-text leading-tight">{course.title}</h2>
              </div>
              {renderChapterList()}
            </div>
          </div>
        </aside>

        {/* 2. メインコンテンツ（講義本文） */}
        <main className="min-w-0">{children}</main>

        {/* 3. PC用：ページ内目次 (TOC) */}
        <aside className="hidden lg:block">
          {hasToc && (
            <div className="sticky top-28 max-h-[calc(100vh-160px)] overflow-y-auto">
              <div className="theme-card p-5">
                <h3 className="font-extrabold text-sm mb-4 text-text uppercase tracking-wider">
                  ページ内目次
                </h3>
                <TocList toc={toc} activeId={activeId} />
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* モバイル用：チャプタードロワー */}
      {isChapterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex" role="dialog" aria-modal="true">
          <div
            className="bg-black/50 absolute inset-0 backdrop-blur-sm"
            onClick={() => setIsChapterDrawerOpen(false)}
          />
          <div className="relative bg-card w-80 max-w-[85vw] h-full p-6 border-r-3 border-border shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">{course.emoji}</span>
                <span className="font-extrabold text-text leading-tight">{course.title}</span>
              </div>
              <button
                onClick={() => setIsChapterDrawerOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="閉じる"
              >
                <X className="h-5 w-5 text-text/60" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              {renderChapterList(() => setIsChapterDrawerOpen(false))}
            </div>
          </div>
        </div>
      )}

      {/* モバイル用：ページ内目次 (TOC) */}
      <MobileToc toc={toc} />
    </div>
  );
}
