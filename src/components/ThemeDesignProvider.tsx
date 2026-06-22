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
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
        if (saved && themeConfig.some((t) => t.id === saved)) {
          setCurrentTheme(saved);
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', currentTheme);
    }
  }, [currentTheme, mounted]);

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
