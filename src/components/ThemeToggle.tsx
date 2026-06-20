// src/components/ThemeToggle.tsx
'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * カラーモード（ライト/ダーク/OS依存）の切り替えコンポーネント（インライン横並び）。
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
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
        <button
          disabled
          className="neo-btn px-4 py-2 flex items-center gap-2 cursor-not-allowed text-text"
        >
          <Monitor className="h-4 w-4" />
          <span className="font-bold text-sm">OS依存</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4" role="group" aria-label="カラーモードの選択">
      <button
        onClick={() => setTheme('light')}
        className={`neo-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          theme === 'light'
            ? 'ring-2 ring-text scale-105 font-bold'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        aria-pressed={theme === 'light'}
        aria-label="ライトモードを選択"
      >
        <Sun className="h-4 w-4" />
        <span className="font-bold text-sm">ライト</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`neo-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          theme === 'dark'
            ? 'ring-2 ring-text scale-105 font-bold'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        aria-pressed={theme === 'dark'}
        aria-label="ダークモードを選択"
      >
        <Moon className="h-4 w-4" />
        <span className="font-bold text-sm">ダーク</span>
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`neo-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
          theme === 'system'
            ? 'ring-2 ring-text scale-105 font-bold'
            : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`}
        aria-pressed={theme === 'system'}
        aria-label="OS設定に応じる"
      >
        <Monitor className="h-4 w-4" />
        <span className="font-bold text-sm">OS依存</span>
      </button>
    </div>
  );
}
