// src/components/ThemeEffectManager.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { useIsClient } from '@/src/hooks/useIsClient';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const GlassmorphismBackdrop = dynamic(
  () => import('@/src/components/theme-effects/GlassmorphismBackdrop'),
  { ssr: false }
);
const MinimalScrollProgress = dynamic(
  () => import('@/src/components/theme-effects/MinimalScrollProgress'),
  { ssr: false }
);
const NeumorphismCursorShadow = dynamic(
  () => import('@/src/components/theme-effects/NeumorphismCursorShadow'),
  { ssr: false }
);
const NordicFireplace = dynamic(() => import('@/src/components/theme-effects/NordicFireplace'), {
  ssr: false,
});
const SteampunkGears = dynamic(() => import('@/src/components/theme-effects/SteampunkGears'), {
  ssr: false,
});
const SynthwaveGrid = dynamic(() => import('@/src/components/theme-effects/SynthwaveGrid'), {
  ssr: false,
});
const TerminalConsole = dynamic(() => import('@/src/components/theme-effects/TerminalConsole'), {
  ssr: false,
});
const ThreeDCardTilt = dynamic(() => import('@/src/components/theme-effects/ThreeDCardTilt'), {
  ssr: false,
});

/**
 * 現在のデザインテーマに応じて、テーマ専用のJSエフェクト／背景コンポーネントへ振り分ける。
 * 各エフェクトの実装は src/components/theme-effects/ 配下を参照。
 * パフォーマンス最適化のため、各エフェクトは next/dynamic で遅延読み込みされ、
 * 選択されたテーマのエフェクトのみがクライアントバンドルに含まれる。
 */
export default function ThemeEffectManager() {
  const { currentTheme, effectsEnabled } = useThemeDesign();
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <>
      {currentTheme === 'minimal' && <MinimalScrollProgress effectsEnabled={effectsEnabled} />}
      {currentTheme === 'neumorphism' && (
        <NeumorphismCursorShadow effectsEnabled={effectsEnabled} />
      )}
      {currentTheme === 'three-d' && <ThreeDCardTilt effectsEnabled={effectsEnabled} />}
      {currentTheme === 'glassmorphism' && (
        <GlassmorphismBackdrop isDark={isDark} effectsEnabled={effectsEnabled} />
      )}
      {currentTheme === 'steampunk' && <SteampunkGears effectsEnabled={effectsEnabled} />}
      {currentTheme === 'synthwave' && (
        <SynthwaveGrid isDark={isDark} effectsEnabled={effectsEnabled} />
      )}
      {currentTheme === 'nordic' && (
        <NordicFireplace isDark={isDark} effectsEnabled={effectsEnabled} />
      )}
      {currentTheme === 'terminal' && <TerminalConsole isDark={isDark} />}
    </>
  );
}
