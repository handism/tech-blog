// lib/toc.ts
import type { TocItem } from './posts';
import { JSDOM } from 'jsdom'; // npm install jsdom

export function generateToc(html: string): TocItem[] {
  const toc: TocItem[] = [];

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // h1〜h6 を全て取得
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach((el) => {
    const level = parseInt(el.tagName[1], 10);
    const id = el.id; // ここで正しい id を取得
    const text = el.textContent?.trim() || '';
    if (!text || !id) return;

    toc.push({ text, id, level });
  });

  return toc;
}
