// src/lib/utils.ts
/**
 * テキストをURL向けのスラッグに変換する。
 */
function toSlug(value: string): string {
  const normalized = value.normalize('NFKC').trim().toLowerCase();
  const symbolExpanded = normalized
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/&/g, ' and ');
  const slug = symbolExpanded
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\p{Mark}-]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug) return slug;

  // 記号のみなどで空文字になるケースは、安定したハッシュ値でフォールバックする。
  return `slug-${hashString(symbolExpanded).toString(36)}`;
}

/**
 * 文字列から安定した32bitハッシュを生成する。
 */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash >>> 0;
}

/**
 * タグ名をURL向けのスラッグに変換する。
 */
export function tagToSlug(tag: string): string {
  return toSlug(tag);
}

/**
 * カテゴリ名をURL向けのスラッグに変換する。
 */
export function categoryToSlug(category: string): string {
  return toSlug(category);
}
