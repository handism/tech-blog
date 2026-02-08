'use client';
import { useState } from 'react';
import SearchBox from '@/src/components/SearchBox';
import TagList from '@/src/components/TagList';
import type { TocItem, Post } from '@/src/types/post';
import { Menu, ChevronUp } from 'lucide-react';

export default function Sidebar({
  posts,
  toc,
  categories,
}: {
  posts?: Post[];
  toc?: TocItem[];
  categories?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasToc = !!(toc && toc.length > 0);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // --- 修正ポイント: JSXを返す「変数」にする（または関数の外に定義する） ---
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
          const indent = (item.level - 1) * 16; // px単位で調整
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
      <SearchBox posts={posts ?? []} />

      {/* カテゴリ・タグ一覧（省略せずそのまま） */}
      {categories && categories.length > 0 && (
        <div className="p-4 border border-border rounded-lg bg-card">
          <h2 className="font-bold text-lg mb-4 text-text">カテゴリ</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat}>
                <a
                  href={`/blog/categories/${cat}`}
                  className="text-text/80 hover:text-accent hover:underline block"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 border border-border rounded-lg bg-card">
        <h2 className="font-bold text-lg mb-4 text-text">タグ</h2>
        <TagList posts={posts ?? []} />
      </div>

      {/* --- TOC セクション --- */}
      {hasToc && (
        <>
          {/* 1. PC用 */}
          <div className="hidden lg:block sticky top-5">
            <div className="p-4 border border-border rounded-lg bg-card max-h-[calc(100vh-120px)] overflow-y-auto">
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

      {/* トップへ戻るボタン */}
      <button
        onClick={scrollToTop}
        className="text-text fixed bottom-6 right-6 z-40 w-12 h-12 bg-card border border-border rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        aria-label="トップへ戻る"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
}
