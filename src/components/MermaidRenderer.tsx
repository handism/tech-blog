// src/components/MermaidRenderer.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * クライアントサイドで Mermaid 記法を解析し、SVG図解を動的にレンダリングするコンポーネント。
 */
export default function MermaidRenderer() {
  const pathname = usePathname();

  useEffect(() => {
    const render = async () => {
      const elements = document.querySelectorAll('.mermaid');
      if (elements.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;

        // ダークモードかどうかの判定 (next-themes や global CSS 変数の data-theme に準拠)
        const isDark =
          document.documentElement.classList.contains('dark') ||
          document.documentElement.getAttribute('data-theme')?.includes('dark') ||
          document.documentElement.getAttribute('data-theme') === 'cyberpunk';

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Lexend, Inter, sans-serif',
          themeVariables: {
            primaryColor: isDark ? '#1e293b' : '#f8fafc',
            primaryTextColor: isDark ? '#f8fafc' : '#0f172a',
            lineColor: isDark ? '#475569' : '#cbd5e1',
          },
        });

        // 描画実行
        await mermaid.run({
          nodes: Array.from(elements) as HTMLElement[],
        });
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };

    render();
  }, [pathname]);

  return null;
}
