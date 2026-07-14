// src/components/theme-effects/SteampunkGears.tsx
'use client';

import { useEffect } from 'react';

/**
 * Steampunk テーマ用の動く歯車。スクロール量に応じて --gear-rotation を更新する。
 */
export default function SteampunkGears({ effectsEnabled }: { effectsEnabled: boolean }) {
  useEffect(() => {
    if (!effectsEnabled) return;

    const handleScroll = () => {
      const rotation = (window.scrollY * 0.15) % 360;
      document.documentElement.style.setProperty('--gear-rotation', `${rotation}deg`);
      document.documentElement.style.setProperty('--gear-rotation-anti', `${-rotation}deg`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [effectsEnabled]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-10">
      {/* 左上の大歯車 */}
      <svg
        className="absolute top-[-80px] left-[-80px] w-64 h-64 text-[#8b6535] fill-none stroke-current stroke-2"
        style={{ transform: effectsEnabled ? 'rotate(var(--gear-rotation))' : 'rotate(0deg)' }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="10" />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M 50 10 L 50 20 M 47 10 L 53 10" transform={`rotate(${i * 30} 50 50)`} />
        ))}
      </svg>
      {/* 右上の小歯車 (噛み合い逆回転) */}
      <svg
        className="absolute top-[100px] left-[130px] w-32 h-32 text-[#a05a0c] fill-none stroke-current stroke-2"
        style={{
          transform: effectsEnabled ? 'rotate(var(--gear-rotation-anti))' : 'rotate(0deg)',
        }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="10" />
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d="M 50 10 L 50 20 M 47 10 L 53 10" transform={`rotate(${i * 45} 50 50)`} />
        ))}
      </svg>
      {/* 右下の大歯車 */}
      <svg
        className="absolute bottom-[-100px] right-[-100px] w-80 h-80 text-[#8b6535] fill-none stroke-current stroke-2"
        style={{ transform: effectsEnabled ? 'rotate(var(--gear-rotation))' : 'rotate(0deg)' }}
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="12" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d="M 50 8 L 50 18 M 46 8 L 54 8" transform={`rotate(${i * 22.5} 50 50)`} />
        ))}
      </svg>
    </div>
  );
}
