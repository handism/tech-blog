// src/lib/utils.ts
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
}

export function findTagBySlug(slug: string, allTags: string[]): string | null {
  return allTags.find((tag) => tagToSlug(tag) === slug) || null;
}
