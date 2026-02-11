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
 * スラッグから元のタグ名を検索する。
 */
export function findTagBySlug(slug: string, allTags: string[]): string | null {
  return allTags.find((tag) => tagToSlug(tag) === slug) || null;
}

/**
 * カテゴリ名をURL向けのスラッグに変換する。
 */
export function categoryToSlug(category: string): string {
  return toSlug(category);
}

/**
 * スラッグから元のカテゴリ名を検索する。
 */
export function findCategoryBySlug(slug: string, allCategories: string[]): string | null {
  return allCategories.find((category) => categoryToSlug(category) === slug) || null;
}
