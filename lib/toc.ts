// lib/toc.ts
import type { TocItem } from './posts';

/**
 * HTML文字列から <h1>-<h6> を抽出して TOC を作る
 * id は既に remark-slug で付与されたものを利用
 */
export function generateToc(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRe = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const attrs = match[2];
    let inner = match[3];

    // id属性を抽出
    const idMatch = /id=["']([^"']+)["']/i.exec(attrs);
    if (!idMatch) continue; // idがなければスキップ
    const id = idMatch[1];

    // inner HTML をテキストに変換
    inner = inner.replace(/<[^>]+>/g, '').trim();
    if (!inner) continue;

    toc.push({ text: inner, id, level });
  }

  return toc;
}
