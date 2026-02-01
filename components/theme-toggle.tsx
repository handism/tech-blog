'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // マイクロタスクキューで次のティックに実行
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // マウント前はプレースホルダーを返す（サーバー/クライアント一致）
  if (!isMounted) {
    return (
      <button
        disabled
        className="rounded-full p-2 text-text transition hover:bg-card opacity-50 cursor-not-allowed"
      >
        🌙
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-full p-2 text-text transition hover:bg-card"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
