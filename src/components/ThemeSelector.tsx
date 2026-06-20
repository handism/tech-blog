// src/components/ThemeSelector.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { themeConfig, type ThemeId } from '@/src/config/site';
import { Check } from 'lucide-react';

/**
 * デザインテーマの選択 UI。
 * /settings ページでテーマのプレビューカードを一覧表示する。
 */
export function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeDesign();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {themeConfig.map((theme) => {
        const isSelected = currentTheme === theme.id;
        return (
          <button
            key={theme.id}
            id={`theme-select-${theme.id}`}
            onClick={() => setTheme(theme.id as ThemeId)}
            aria-pressed={isSelected}
            aria-label={`${theme.label}テーマに切り替え`}
            className={`group relative flex flex-col theme-card theme-card-hover overflow-hidden text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              isSelected
                ? 'ring-4 ring-accent ring-offset-2 ring-offset-bg scale-[1.02]'
                : 'hover:scale-[1.02]'
            }`}
          >
            {/* プレビューエリア */}
            <div
              className="relative h-28 w-full flex items-center justify-center overflow-hidden border-b border-border"
              style={{ background: theme.previewBg }}
            >
              {/* ミニカードプレビュー */}
              <div
                className="w-20 h-16 rounded-lg flex flex-col gap-1.5 p-2 shadow-md"
                style={{
                  background: theme.previewCard,
                  border:
                    theme.id === 'neumorphism'
                      ? 'none'
                      : `2px solid ${theme.id === 'glassmorphism' ? 'rgba(255,255,255,0.3)' : theme.previewAccent}`,
                  backdropFilter: theme.id === 'glassmorphism' ? 'blur(8px)' : undefined,
                }}
              >
                {/* ヘッダーバー */}
                <div
                  className="h-1.5 rounded-full w-full"
                  style={{ backgroundColor: theme.previewAccent }}
                />
                {/* コンテンツライン */}
                <div
                  className="h-1 rounded-full w-3/4 opacity-60"
                  style={{ backgroundColor: theme.previewAccent }}
                />
                <div
                  className="h-1 rounded-full w-1/2 opacity-40"
                  style={{ backgroundColor: theme.previewAccent }}
                />
                {/* アクションボタン */}
                <div
                  className="h-3 rounded w-1/2 mt-auto"
                  style={{
                    backgroundColor: theme.previewAccent,
                    opacity: 0.9,
                  }}
                />
              </div>

              {/* 選択済みバッジ */}
              {isSelected && (
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: theme.previewAccent }}
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* ラベルエリア */}
            <div className="flex flex-col gap-0.5 px-3 py-2.5 bg-card flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{theme.emoji}</span>
                <span className="text-xs font-bold text-text leading-tight">{theme.label}</span>
              </div>
              <p className="text-xs text-text opacity-60 leading-snug">{theme.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
