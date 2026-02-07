// lib/toc.ts
import type { TocItem } from '../types/posts';

// Generate TOC from HTML string by extracting <h1>-<h6> tags and their ids/text.
// This ensures IDs match the final HTML (including any prefixes like "user-content-").
export function generateToc(html: string): TocItem[] {
  const toc: TocItem[] = [];

  const headingRe = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const attrs = match[2];
    let inner = match[3];

    // extract id attr if present
    const idMatch = /id=(?:"|')([^"']+)(?:"|')/i.exec(attrs);
    const id = idMatch ? idMatch[1] : '';

    // strip any inner HTML tags for the text
    inner = inner.replace(/<[^>]+>/g, '').trim();
    if (!inner) continue;

    toc.push({ text: inner, id, level });
  }

  return toc;
}
