// src/components/ThemeToggle.tsx
'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useIsClient } from '@/src/hooks/useIsClient';

const THEME_OPTIONS = [
  { value: 'light', icon: Sun, label: 'ライト', ariaLabel: 'ライトモードを選択' },
  { value: 'dark', icon: Moon, label: 'ダーク', ariaLabel: 'ダークモードを選択' },
  { value: 'system', icon: Monitor, label: 'OS依存', ariaLabel: 'OS設定に応じる' },
] as const;

/**
 * カラーモード（ライト/ダーク/OS依存）の切り替えコンポーネント（インライン横並び）。
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMounted = useIsClient();

  // マウント前はプレースホルダーを返す
  if (!isMounted) {
    return (
      <div className="flex flex-wrap gap-4 opacity-50">
        {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            disabled
            className="theme-btn px-4 py-2 flex items-center gap-2 cursor-not-allowed text-text"
          >
            <Icon className="h-4 w-4" />
            <span className="font-bold text-sm">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4" role="group" aria-label="カラーモードの選択">
      {THEME_OPTIONS.map(({ value, icon: Icon, label, ariaLabel }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`theme-btn px-4 py-2 flex items-center gap-2 text-text transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              isActive
                ? 'ring-2 ring-text scale-105 font-bold'
                : 'opacity-70 hover:opacity-100 hover:scale-105'
            }`}
            aria-pressed={isActive}
            aria-label={ariaLabel}
          >
            <Icon className="h-4 w-4" />
            <span className="font-bold text-sm">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
