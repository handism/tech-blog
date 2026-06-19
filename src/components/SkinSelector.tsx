// src/components/SkinSelector.tsx
'use client';

import { DEFAULT_SKIN, SKIN_STORAGE_KEY, skinConfig, type SkinId } from '@/src/config/site';
import { useEffect, useState } from 'react';

/**
 * カラーテーマ（スキン）の切り替えコンポーネント（インライン表示）
 */
export function SkinSelector() {
  const [currentSkin, setCurrentSkin] = useState<SkinId>(() => {
    if (typeof window === 'undefined') return DEFAULT_SKIN;
    const saved = localStorage.getItem(SKIN_STORAGE_KEY) as SkinId | null;
    return saved && skinConfig.some((s) => s.id === saved) ? (saved as SkinId) : DEFAULT_SKIN;
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (skinId: SkinId) => {
    setCurrentSkin(skinId);
    localStorage.setItem(SKIN_STORAGE_KEY, skinId);
    document.documentElement.setAttribute('data-skin', skinId);
  };

  if (!isMounted) {
    // マウント前はスケルトン（プレースホルダー）を表示
    return (
      <div className="flex flex-wrap gap-4 items-end opacity-50">
        {skinConfig.map((skin) => (
          <div key={skin.id} className="flex flex-col items-center gap-2">
            <span
              className="block w-10 h-10 rounded-full border-2 border-border"
              style={{ backgroundColor: skin.lightColor }}
            />
            <span className="text-xs text-text opacity-70 font-medium">{skin.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-4 items-end"
      role="group"
      aria-label="アクセントカラーの選択"
    >
      {skinConfig.map((skin) => {
        const isSelected = currentSkin === skin.id;
        return (
          <button
            key={skin.id}
            onClick={() => handleSelect(skin.id)}
            className="flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl p-1 -m-1"
            aria-pressed={isSelected}
            aria-label={`${skin.label}カラーを選択`}
          >
            <span
              className={`block w-10 h-10 rounded-full border-2 transition-transform duration-200 group-hover:scale-110 group-active:scale-95 ${
                isSelected
                  ? 'border-text scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[2px_2px_0px_0px_var(--accent)]'
                  : 'border-border'
              }`}
              style={{ backgroundColor: skin.lightColor }}
              aria-hidden="true"
            />
            <span
              className={`text-xs font-medium transition-colors ${
                isSelected ? 'text-text font-bold' : 'text-text opacity-70 group-hover:opacity-100'
              }`}
            >
              {skin.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
