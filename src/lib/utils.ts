// src/lib/utils.ts
/**
 * テキストをURL向けのスラッグに変換する。
 */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
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
