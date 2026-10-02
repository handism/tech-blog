// src/lib/base-path.ts
import { siteConfig } from '@/src/config/site';

/**
 * サイトルート相対のパス（`/images/foo.webp` など）に basePath を付与する。
 * `next/link` や `useRouter` は自動で付与するが、`<img>`・`<a>`・`fetch`・`next/image` の src などは
 * 付与されないため、public 配下のアセットや Route Handler を参照する際はこれを通す。
 * 外部 URL・プロトコル相対 URL・相対パス・付与済みのパスはそのまま返す。
 */
export function withBasePath(path: string): string {
  const { basePath } = siteConfig;
  if (!basePath || !path.startsWith('/') || path.startsWith('//')) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
