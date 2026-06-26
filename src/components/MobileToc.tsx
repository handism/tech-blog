// src/components/MobileToc.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import type { TocItem } from '@/src/types/post';

interface MobileTocProps {
  toc?: TocItem[];
}

export default function MobileToc({ toc }: MobileTocProps) {
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

  if (!hasToc) return null;

  const renderTocList = () => (
    <ul className="space-y-2 text-sm font-bold">
      {toc?.map((item) => {
        const indent = (item.level - 1) * 16;
        const isActive = activeId === item.id;
        return (
          <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
            <a
              href={`#${item.id}`}
              onClick={() => setIsOpen(false)}
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
    <>
      {/* スマホ用ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-text lg:!hidden fixed bottom-20 right-6 z-40 w-12 h-12 theme-btn flex items-center justify-center"
        aria-label="目次を開く"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* スマホ用オーバーレイ */}
      <div
        className={`lg:hidden fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
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
  );
}
