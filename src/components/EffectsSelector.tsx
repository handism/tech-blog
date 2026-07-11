// src/components/EffectsSelector.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { useIsClient } from '@/src/hooks/useIsClient';
import { Check } from 'lucide-react';

/**
 * アニメーションとエフェクトの ON/OFF を切り替えるセレクターコンポーネント。
 */
export function EffectsSelector() {
  const { effectsEnabled, setEffectsEnabled } = useThemeDesign();
  const isMounted = useIsClient();

  const effectiveEffectsEnabled = isMounted ? effectsEnabled : true;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
      <button
        onClick={() => setEffectsEnabled(true)}
        className={`theme-btn text-left p-5 flex items-center justify-between transition-all duration-200 ${
          effectiveEffectsEnabled
            ? 'ring-4 ring-accent ring-offset-2 ring-offset-bg scale-[1.02] bg-secondary'
            : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
        }`}
        aria-pressed={effectiveEffectsEnabled}
        aria-label="アニメーションとエフェクトを有効化"
      >
        <div className="flex items-center gap-3 pr-2">
          <span className="text-2xl shrink-0" role="img" aria-hidden="true">
            ✨
          </span>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-text">
              アニメーションとエフェクトを有効化
            </h3>
            <p className="text-xs text-text opacity-60 mt-0.5 leading-snug">
              背景アニメーションや3Dチルトなど、テーマのリッチな視覚効果をすべて表示します。
            </p>
          </div>
        </div>
        {effectiveEffectsEnabled && (
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shrink-0 shadow-sm">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        )}
      </button>

      <button
        onClick={() => setEffectsEnabled(false)}
        className={`theme-btn text-left p-5 flex items-center justify-between transition-all duration-200 ${
          !effectiveEffectsEnabled
            ? 'ring-4 ring-accent ring-offset-2 ring-offset-bg scale-[1.02] bg-secondary'
            : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
        }`}
        aria-pressed={!effectiveEffectsEnabled}
        aria-label="動きを停止（パフォーマンス優先）"
      >
        <div className="flex items-center gap-3 pr-2">
          <span className="text-2xl shrink-0" role="img" aria-hidden="true">
            🔕
          </span>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-text">
              動きを停止（パフォーマンス優先）
            </h3>
            <p className="text-xs text-text opacity-60 mt-0.5 leading-snug">
              アニメーションを静止させ、イベント監視を解除します。目の疲れやデバイスの負荷を軽減します。
            </p>
          </div>
        </div>
        {!effectiveEffectsEnabled && (
          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white shrink-0 shadow-sm">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
        )}
      </button>
    </div>
  );
}
