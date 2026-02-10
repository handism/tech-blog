// src/lib/toc.ts
import type { TocItem } from '../types/post';

/**
 * HTML文字列から目次（見出し）情報を生成する。
 */
export function generateToc(html: string): TocItem[] {
  const toc: TocItem[] = [];

  const headingRe = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const attrs = match[2];
    let inner = match[3];

    const idMatch = /id=(?:"|')([^"']+)(?:"|')/i.exec(attrs);
    const id = idMatch ? idMatch[1] : '';

    inner = inner.replace(/<[^>]+>/g, '').trim();
    if (!inner) continue;

    toc.push({ text: inner, id, level });
  }

  return toc;
}
