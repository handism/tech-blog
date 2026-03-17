// src/components/SkinSelector.tsx
'use client';

import { DEFAULT_SKIN, SKIN_STORAGE_KEY, skinConfig, type SkinId } from '@/src/config/site';
import { useEffect, useState } from 'react';

/**
 * カラーテーマ（スキン）の切り替えボタン群。
 */
export function SkinSelector() {
  const [currentSkin, setCurrentSkin] = useState<SkinId>(DEFAULT_SKIN);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SKIN_STORAGE_KEY) as SkinId | null;
    if (saved && skinConfig.some((s) => s.id === saved)) {
      setCurrentSkin(saved);
    }
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (skinId: SkinId) => {
    setCurrentSkin(skinId);
    localStorage.setItem(SKIN_STORAGE_KEY, skinId);
    document.documentElement.setAttribute('data-skin', skinId);
  };

  if (!isMounted) {
    return (
      <div className="flex gap-0.5 opacity-0 pointer-events-none" aria-hidden="true">
        {skinConfig.map((s) => (
          <div key={s.id} className="p-1">
            <div className="w-4 h-4 rounded-full bg-border" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="カラーテーマを選択">
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
          <span className="block w-4 h-4 rounded-full" style={{ backgroundColor: skin.lightColor }} />
        </button>
      ))}
    </div>
  );
}
