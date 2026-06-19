// src/components/ThemeToggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * カラーモード（ライト/ダーク）の切り替えコンポーネント（インライン横並び）。
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // マウント前はプレースホルダーを返す
  if (!isMounted) {
    return (
      <div className="flex flex-wrap gap-4 opacity-50">
        <button
          disabled
          className="neo-btn px-4 py-2 flex items-center gap-2 cursor-not-allowed text-text"
        >
          <Sun className="h-4 w-4" />
          <span className="font-bold text-sm">ライト</span>
        </button>
        <button
          disabled
          className="neo-btn px-4 py-2 flex items-center gap-2 cursor-not-allowed text-text"
        >
          <Moon className="h-4 w-4" />
          <span className="font-bold text-sm">ダーク</span>
        </button>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-wrap gap-4" role="group" aria-label="カラーモードの選択">
      <button
        onClick={() => setTheme('light')}
        className={`neo-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          !isDark
            ? 'ring-2 ring-text scale-105 font-bold'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        aria-pressed={!isDark}
        aria-label="ライトモードを選択"
      >
        <Sun className="h-4 w-4" />
        <span className="font-bold text-sm">ライト</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`neo-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          isDark
            ? 'ring-2 ring-text scale-105 font-bold'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        aria-pressed={isDark}
        aria-label="ダークモードを選択"
      >
        <Moon className="h-4 w-4" />
        <span className="font-bold text-sm">ダーク</span>
      </button>
    </div>
  );
}
