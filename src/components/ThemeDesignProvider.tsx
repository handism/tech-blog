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
  // テーマの初期値
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const themeAttr = document.documentElement.getAttribute('data-theme') as ThemeId | null;
      if (themeAttr && themeConfig.some((t) => t.id === themeAttr)) {
        return themeAttr;
      }
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
        if (saved && themeConfig.some((t) => t.id === saved)) {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_THEME;
  });

  // レイアウトの初期値
  const [currentLayout, setCurrentLayout] = useState<LayoutId>(() => {
    if (typeof window !== 'undefined') {
      const layoutAttr = document.documentElement.getAttribute('data-layout') as LayoutId | null;
      if (layoutAttr && layoutConfig.some((l) => l.id === layoutAttr)) {
        return layoutAttr;
      }
      try {
        const saved = localStorage.getItem(LAYOUT_STORAGE_KEY) as LayoutId | null;
        if (saved && layoutConfig.some((l) => l.id === saved)) {
          return saved;
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_LAYOUT;
  });

  const mounted = useIsClient();

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.documentElement.setAttribute('data-layout', currentLayout);
    }
  }, [currentTheme, currentLayout, mounted]);

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
