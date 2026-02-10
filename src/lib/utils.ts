// src/lib/utils.ts
/**
 * タグ名をURL向けのスラッグに変換する。
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
}

/**
 * スラッグから元のタグ名を検索する。
 */
export function findTagBySlug(slug: string, allTags: string[]): string | null {
  return allTags.find((tag) => tagToSlug(tag) === slug) || null;
}
