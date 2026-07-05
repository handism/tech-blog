// src/components/LayoutSelector.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { layoutConfig } from '@/src/config/site';

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
            onClick={() => setLayout(layout.id)}
            className={`theme-btn text-left p-5 flex flex-col justify-between transition-all duration-200 ${
              isSelected
                ? 'border-accent ring-2 ring-accent/20 bg-secondary'
                : 'opacity-80 hover:opacity-100'
            }`}
            aria-pressed={isSelected}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {layout.emoji}
              </span>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-text">{layout.label}</h3>
                <p className="text-xs text-text opacity-60 mt-0.5">
                  {layout.id === '1-column' && 'シンプルな縦一列のリスト'}
                  {layout.id === '2-column' && '標準の2列カードグリッド'}
                  {layout.id === '3-column' && '情報密度の高い3列グリッド'}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
