// src/components/theme-effects/MinimalScrollProgress.tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * Minimal テーマ用の極細スクロール進捗ゲージ。
 */
export default function MinimalScrollProgress({ effectsEnabled }: { effectsEnabled: boolean }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!effectsEnabled) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [effectsEnabled]);

  if (!effectsEnabled) return null;

  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-blue-500 z-50 transition-all duration-75"
      style={{ width: `${scrollProgress}%` }}
    />
  );
}
