// src/components/theme-effects/ThreeDCardTilt.tsx
'use client';

import { useEffect } from 'react';

/**
 * 3D Interactive テーマ用のカードチルト効果（JSによる3D Tilt）。
 */
export default function ThreeDCardTilt({ effectsEnabled }: { effectsEnabled: boolean }) {
  useEffect(() => {
    if (!effectsEnabled) return;

    let activeCard: HTMLElement | null = null;
    let rafId: number | null = null;

    const resetCardStyle = (card: HTMLElement) => {
      card.style.transform = '';
      card.style.setProperty('--parallax-x', '0px');
      card.style.setProperty('--parallax-y', '0px');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const target = e.target as HTMLElement;
        if (!target) return;

        const card = target.closest('.theme-card') as HTMLElement | null;

        // ホバーするカードが変わった場合の処理
        if (card !== activeCard) {
          if (activeCard) {
            resetCardStyle(activeCard);
          }
          activeCard = card;
        }

        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // マウスのカード内X座標
        const y = e.clientY - rect.top; // マウスのカード内Y座標

        // 中心からのズレを比率にする (-0.5 to 0.5)
        const px = x / rect.width - 0.5;
        const py = y / rect.height - 0.5;

        // 3D回転角を算出 (最大15度)
        const tiltX = (py * -15).toFixed(1);
        const tiltY = (px * 15).toFixed(1);

        // 内側の画像やテキストにもパララックスを効かせるため、カスタムプロパティを更新
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--parallax-x', `${px * 12}px`);
        card.style.setProperty('--parallax-y', `${py * 12}px`);
      });
    };

    const handleMouseLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (activeCard) {
        resetCardStyle(activeCard);
        activeCard = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);

      if (activeCard) {
        resetCardStyle(activeCard);
      }
      // 念のため、現在存在するすべての .theme-card をリセット
      document.querySelectorAll('.theme-card').forEach((c) => {
        resetCardStyle(c as HTMLElement);
      });
    };
  }, [effectsEnabled]);

  return null;
}
