'use client';

import { useEffect } from 'react';

export function CodeCopyButton() {
  useEffect(() => {
    const pres = document.querySelectorAll('pre');

    pres.forEach((pre) => {
      // 二重追加防止
      if (pre.querySelector('.code-copy-button')) return;

      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.className =
        'code-copy-button absolute right-3 top-3 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700';

      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent;
        if (!code) return;

        await navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 1200);
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }, []);

  return null;
}
