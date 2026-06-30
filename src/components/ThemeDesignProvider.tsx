// src/components/ThemeDesignProvider.tsx
'use client';

import { DEFAULT_THEME, THEME_STORAGE_KEY, themeConfig, type ThemeId } from '@/src/config/site';
import { useIsClient } from '@/src/hooks/useIsClient';
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
  const mounted = useIsClient();

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

  return (
    <ThemeDesignContext.Provider value={value}>
      <link rel="stylesheet" href={`/themes/theme-${currentTheme}.css`} precedence="default" />
      {children}
    </ThemeDesignContext.Provider>
  );
}

/**
 * デザインテーマの Context を取得するフック。
 */
export function useThemeDesign() {
  return useContext(ThemeDesignContext);
}
