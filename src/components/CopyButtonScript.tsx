// src/components/CopyButtonScript.tsx
'use client';
import { useEffect } from 'react';

/**
 * コードブロックにコピー用ボタンを付与するクライアントスクリプト。
 */
export default function CopyButtonScript() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre');

    blocks.forEach((block) => {
      // すでにボタンがある場合はスキップ
      if (block.querySelector('.copy-button')) return;

      const button = document.createElement('button');
      button.innerText = 'Copy';
      button.className = 'copy-button'; // CSSでスタイリング
      button.setAttribute('aria-label', 'コードをコピー');

      button.addEventListener('click', () => {
        const code = block.querySelector('code')?.innerText || '';
        navigator.clipboard.writeText(code);
        button.innerText = 'Copied!';
        button.setAttribute('aria-label', 'コピーしました');
        setTimeout(() => {
          button.innerText = 'Copy';
          button.setAttribute('aria-label', 'コードをコピー');
        }, 2000);
      });

      block.style.position = 'relative';
      block.appendChild(button);
    });
  }, []);

  return null;
}
