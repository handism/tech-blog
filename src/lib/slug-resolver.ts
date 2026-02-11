import { notFound } from 'next/navigation';

/**
 * スラッグに対応する値を候補から解決し、見つからなければ404を返す。
 */
export function resolveSlugOrNotFound(
  slug: string,
  candidates: string[],
  toSlug: (value: string) => string
): string {
  const resolved = candidates.find((candidate) => toSlug(candidate) === slug);
  if (!resolved) {
    notFound();
  }
  return resolved;
}
