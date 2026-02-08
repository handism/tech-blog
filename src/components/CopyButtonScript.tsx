// components/CopyButtonScript.tsx
'use client';
import { useEffect } from 'react';

export default function CopyButtonScript() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre');

    blocks.forEach((block) => {
      // すでにボタンがある場合はスキップ
      if (block.querySelector('.copy-button')) return;

      const button = document.createElement('button');
      button.innerText = 'Copy';
      button.className = 'copy-button'; // CSSでスタイリング

      button.addEventListener('click', () => {
        const code = block.querySelector('code')?.innerText || '';
        navigator.clipboard.writeText(code);
        button.innerText = 'Copied!';
        setTimeout(() => (button.innerText = 'Copy'), 2000);
      });

      block.style.position = 'relative';
      block.appendChild(button);
    });
  }, []);

  return null;
}
