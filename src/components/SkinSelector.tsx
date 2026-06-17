// src/components/SkinSelector.tsx
'use client';

import { DEFAULT_SKIN, SKIN_STORAGE_KEY, skinConfig, type SkinId } from '@/src/config/site';
import { Palette } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/**
 * カラーテーマ（スキン）の切り替えボタン。パレットアイコンをクリックでドロップダウン表示。
 */
export function SkinSelector() {
  const [currentSkin, setCurrentSkin] = useState<SkinId>(() => {
    if (typeof window === 'undefined') return DEFAULT_SKIN;
    const saved = localStorage.getItem(SKIN_STORAGE_KEY) as SkinId | null;
    return saved && skinConfig.some((s) => s.id === saved) ? (saved as SkinId) : DEFAULT_SKIN;
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMounted, isOpen]);

  const handleSelect = (skinId: SkinId) => {
    setCurrentSkin(skinId);
    localStorage.setItem(SKIN_STORAGE_KEY, skinId);
    document.documentElement.setAttribute('data-skin', skinId);
    setIsOpen(false);
  };

  if (!isMounted) {
    return (
      <button disabled className="neo-btn w-9 h-9 text-text opacity-50 cursor-not-allowed">
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="neo-btn w-9 h-9 text-text"
        aria-label="カラーテーマを選択"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Palette className="h-4 w-4" />
      </button>

      <div
        className={`
          absolute right-0 top-11 p-2
          flex gap-2
          rounded-xl border-2 border-border
          bg-card
          shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)]
          transition-all z-50
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
        `}
        role="group"
      >
        {skinConfig.map((skin) => (
          <button
            key={skin.id}
            onClick={() => handleSelect(skin.id)}
            className={`p-0.5 rounded-full border border-border transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
              currentSkin === skin.id
                ? 'border-2 border-text scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[2px_2px_0px_0px_var(--accent)]'
                : ''
            }`}
            aria-label={`${skin.label}テーマに切り替え`}
            aria-pressed={currentSkin === skin.id}
            title={skin.label}
          >
            <span
              className="block w-4 h-4 rounded-full"
              style={{ backgroundColor: skin.lightColor }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
