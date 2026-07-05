// src/components/LayoutSelector.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { layoutConfig } from '@/src/config/site';
import { Check } from 'lucide-react';

/**
 * 記事一覧のレイアウト（列数）を選択するコンポーネント。
 */
export function LayoutSelector() {
  const { currentLayout, setLayout } = useThemeDesign();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {layoutConfig.map((layout) => {
        const isSelected = currentLayout === layout.id;
        return (
          <button
            key={layout.id}
            id={`layout-select-${layout.id}`}
            onClick={() => setLayout(layout.id)}
            className={`theme-btn text-left p-5 flex items-center justify-between transition-all duration-200 ${
              isSelected
                ? 'ring-4 ring-accent ring-offset-2 ring-offset-bg scale-[1.02] bg-secondary'
                : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
            }`}
            aria-pressed={isSelected}
            aria-label={`${layout.label}レイアウトに切り替え`}
          >
            <div className="flex items-center gap-3 pr-2">
              <span className="text-2xl shrink-0" role="img" aria-hidden="true">
                {layout.emoji}
              </span>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text">{layout.label}</h3>
                <p className="text-xs text-text opacity-60 mt-0.5 leading-snug">
                  {layout.id === '1-column' && 'シンプルな縦一列のリスト'}
                  {layout.id === '2-column' && '標準の2列カードグリッド'}
                  {layout.id === '3-column' && '情報密度の高い3列グリッド'}
                </p>
              </div>
            </div>
            {isSelected && (
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shrink-0 shadow-sm">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
