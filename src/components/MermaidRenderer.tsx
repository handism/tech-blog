// src/components/MermaidRenderer.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useThemeDesign } from '@/src/components/ThemeDesignProvider';

/**
 * クライアントサイドで Mermaid 記法を解析し、SVG図解を動的にレンダリングするコンポーネント。
 * カラーモードやデザインテーマの変更を監視し、動的な再描画にも対応。
 */
export default function MermaidRenderer() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const { currentTheme } = useThemeDesign();

  useEffect(() => {
    const render = async () => {
      const elements = document.querySelectorAll('.mermaid');
      if (elements.length === 0) return;

      try {
        const mermaid = (await import('mermaid')).default;

        // ダークモードかどうかの判定 (next-themes や global CSS 変数の data-theme に準拠)
        const isDark =
          resolvedTheme === 'dark' ||
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

        const nodesToRender: HTMLElement[] = [];
        elements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          // すでに描画されている場合、元のソースコードを復元する
          let src = htmlEl.getAttribute('data-mermaid-src');
          if (!src) {
            src = htmlEl.textContent || '';
            htmlEl.setAttribute('data-mermaid-src', src);
          }
          // 要素の中身を元の Mermaid 構文テキストに戻し、描画フラグをクリア
          htmlEl.textContent = src;
          htmlEl.removeAttribute('data-processed');
          nodesToRender.push(htmlEl);
        });

        // 描画実行
        await mermaid.run({
          nodes: nodesToRender,
        });
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };

    render();
  }, [pathname, resolvedTheme, currentTheme]);

  return null;
}
