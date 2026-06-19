// src/components/ThemeDesignProvider.tsx
'use client';

import { DEFAULT_THEME, THEME_STORAGE_KEY, themeConfig, type ThemeId } from '@/src/config/site';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeDesignContextValue {
  currentTheme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
}

const ThemeDesignContext = createContext<ThemeDesignContextValue>({
  currentTheme: DEFAULT_THEME,
  setTheme: () => {},
});

/**
 * デザインテーマ（スタイル全体）を管理するプロバイダー。
 * LocalStorage に保存し、html[data-theme] に反映する。
 */
export function ThemeDesignProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    // useState の初期化関数でクライアント側の保存値を取得
    if (typeof window === 'undefined') return DEFAULT_THEME;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (saved && themeConfig.some((t) => t.id === saved)) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_THEME;
  });

  // DOM の data-theme 属性をテーマ変更に追従させる（DOM との同期のみ、副作用として正当）
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const setTheme = useCallback((themeId: ThemeId) => {
    setCurrentTheme(themeId);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
    document.documentElement.setAttribute('data-theme', themeId);
  }, []);

  const value = useMemo(() => ({ currentTheme, setTheme }), [currentTheme, setTheme]);

  return <ThemeDesignContext.Provider value={value}>{children}</ThemeDesignContext.Provider>;
}

/**
 * デザインテーマの Context を取得するフック。
 */
export function useThemeDesign() {
  return useContext(ThemeDesignContext);
}
