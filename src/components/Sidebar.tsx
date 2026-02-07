'use client';
import { useState } from 'react';
import SearchBox from '@/src/components/SearchBox';
import TagList from '@/src/components/TagList';
import type { TocItem, Post } from '@/src/types/post';

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
    <div className="space-y-6">
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
      {toc && toc.length > 0 && (
        <>
          {/* 1. PC用 */}
          <div className="hidden lg:block p-4 border border-border rounded-lg bg-card max-h-[calc(100vh-120px)] overflow-y-auto sticky top-24">
            {tocElements}
          </div>

          {/* 2. スマホ用ボタン */}
          <button
            onClick={() => setIsOpen(true)}
            className="text-text lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-accent rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            aria-label="目次を開く"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
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
              className={`absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto border-t border-border shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {tocElements}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
