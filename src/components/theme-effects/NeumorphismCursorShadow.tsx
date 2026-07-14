// src/components/theme-effects/NeumorphismCursorShadow.tsx
'use client';

import { useEffect } from 'react';

/**
 * Neumorphism テーマ用の光源追従シャドウ（マウス追従で --mx / --my を更新）。
 */
export default function NeumorphismCursorShadow({ effectsEnabled }: { effectsEnabled: boolean }) {
  useEffect(() => {
    if (!effectsEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // 画面全体に対するマウス位置の比率 (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // 影のズレ幅を計算 (最大12px)
      const shadowX = (x * 12).toFixed(1);
      const shadowY = (y * 12).toFixed(1);

      document.documentElement.style.setProperty('--mx', `${shadowX}px`);
      document.documentElement.style.setProperty('--my', `${shadowY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [effectsEnabled]);

  return null;
}
