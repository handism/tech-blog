// src/components/ThemeDesignProvider.tsx
'use client';

import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  themeConfig,
  type ThemeId,
  type LayoutId,
  DEFAULT_LAYOUT,
  LAYOUT_STORAGE_KEY,
  layoutConfig,
} from '@/src/config/site';
import { useIsClient } from '@/src/hooks/useIsClient';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeDesignContextValue {
  currentTheme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  currentLayout: LayoutId;
  setLayout: (layoutId: LayoutId) => void;
}

const ThemeDesignContext = createContext<ThemeDesignContextValue>({
  currentTheme: DEFAULT_THEME,
  setTheme: () => {},
  currentLayout: DEFAULT_LAYOUT,
  setLayout: () => {},
});

/**
 * デザインテーマ（スタイル全体）およびレイアウトモードを管理するプロバイダー。
 * LocalStorage に保存し、html[data-theme], html[data-layout] に反映する。
 */
export function ThemeDesignProvider({ children }: { children: React.ReactNode }) {
  // 初期状態はSSRハイドレーションエラー防止のためデフォルト値に固定
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [currentLayout, setCurrentLayout] = useState<LayoutId>(DEFAULT_LAYOUT);
  const [isRestored, setIsRestored] = useState(false);

  const mounted = useIsClient();

  // マウント後に LocalStorage または html の data-* 属性から設定を安全に復元する
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        try {
          // テーマの復元
          // まず LocalStorage に保存されている設定を優先する
          const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
          if (savedTheme && themeConfig.some((t) => t.id === savedTheme)) {
            setCurrentTheme(savedTheme);
          } else {
            // なければ DOM の data-theme 属性を確認する
            const themeAttr = document.documentElement.getAttribute('data-theme') as ThemeId | null;
            if (themeAttr && themeConfig.some((t) => t.id === themeAttr)) {
              setCurrentTheme(themeAttr);
            }
          }

          // レイアウトの復元
          // まず LocalStorage に保存されている設定を優先する
          const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutId | null;
          if (savedLayout && layoutConfig.some((l) => l.id === savedLayout)) {
            setCurrentLayout(savedLayout);
          } else {
            // なければ DOM の data-layout 属性を確認する
            const layoutAttr = document.documentElement.getAttribute(
              'data-layout'
            ) as LayoutId | null;
            if (layoutAttr && layoutConfig.some((l) => l.id === layoutAttr)) {
              setCurrentLayout(layoutAttr);
            }
          }
        } catch {
          // ignore
        } finally {
          setIsRestored(true);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  // 設定復元後にのみ DOM にテーマとレイアウトを適用する（デフォルト値での意図しない上書きを防ぐ）
  useEffect(() => {
    if (mounted && isRestored) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.setAttribute('data-layout', currentLayout);
    }
  }, [currentTheme, currentLayout, mounted, isRestored]);

  const setTheme = useCallback((themeId: ThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', themeId);
  }, []);

  const setLayout = useCallback((layoutId: LayoutId) => {
    setCurrentLayout(layoutId);
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, layoutId);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-layout', layoutId);
  }, []);

  const value = useMemo(
    () => ({ currentTheme, setTheme, currentLayout, setLayout }),
    [currentTheme, setTheme, currentLayout, setLayout]
  );

  return (
    <ThemeDesignContext.Provider value={value}>
      <link rel="stylesheet" href={`/themes/theme-${currentTheme}.css`} precedence="default" />
      {children}
    </ThemeDesignContext.Provider>
  );
}

/**
 * デザインテーマとレイアウトの Context を取得するフック。
 */
export function useThemeDesign() {
  return useContext(ThemeDesignContext);
}
