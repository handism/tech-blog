// src/components/ThemeEffectManager.tsx
'use client';

import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import GlassmorphismBackdrop from '@/src/components/theme-effects/GlassmorphismBackdrop';
import MinimalScrollProgress from '@/src/components/theme-effects/MinimalScrollProgress';
import NeumorphismCursorShadow from '@/src/components/theme-effects/NeumorphismCursorShadow';
import NordicFireplace from '@/src/components/theme-effects/NordicFireplace';
import SteampunkGears from '@/src/components/theme-effects/SteampunkGears';
import SynthwaveGrid from '@/src/components/theme-effects/SynthwaveGrid';
import TerminalConsole from '@/src/components/theme-effects/TerminalConsole';
import ThreeDCardTilt from '@/src/components/theme-effects/ThreeDCardTilt';
import { useIsClient } from '@/src/hooks/useIsClient';
import { useTheme } from 'next-themes';

/**
 * 現在のデザインテーマに応じて、テーマ専用のJSエフェクト／背景コンポーネントへ振り分ける。
 * 各エフェクトの実装は src/components/theme-effects/ 配下を参照。
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
