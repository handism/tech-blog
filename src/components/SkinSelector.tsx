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
      <button disabled className="rounded-full p-2 text-text">
        <Palette className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-2 text-text transition hover:bg-card"
        aria-label="カラーテーマを選択"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Palette className="h-5 w-5" />
      </button>

      <div
        className={`
          absolute right-0 mt-2 p-2
          flex gap-1.5
          rounded-md border border-border
          bg-card/95 backdrop-blur-md
          shadow-xl shadow-black/20
          transition-all z-50
          ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
        `}
        role="group"
      >
        {skinConfig.map((skin) => (
          <button
            key={skin.id}
            onClick={() => handleSelect(skin.id)}
            className={`p-1 rounded-full transition-all hover:scale-110 ${
              currentSkin === skin.id ? 'ring-2 ring-offset-1 ring-text/50 scale-110' : ''
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
