// src/lib/toc.ts
import type { TocItem } from '../types/post';

/**
 * HASTノードの最小表現。
 */
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * HASTノード配下のテキストを連結する。
 */
function toText(node: HastNode): string {
  if (node.type === 'text') {
    return node.value ?? '';
  }

  if (!node.children || node.children.length === 0) {
    return '';
  }

  return node.children.map((child) => toText(child)).join('');
}

/**
 * HASTから目次（見出し）情報を生成する。
 */
export function generateTocFromHast(tree: unknown): TocItem[] {
  const toc: TocItem[] = [];

  function walk(node: HastNode): void {
    if (node.type === 'element' && node.tagName && /^h[1-6]$/.test(node.tagName)) {
      const level = Number(node.tagName.slice(1));
      const idProp = node.properties?.id;
      const id = typeof idProp === 'string' ? idProp : '';
      const text = toText(node).trim();

      if (text) {
        toc.push({ id, text, level });
      }
    }

    if (node.children) {
      node.children.forEach((child) => walk(child));
    }
  }

  if (tree && typeof tree === 'object' && 'type' in tree) {
    walk(tree as HastNode);
  }

  return toc;
}
