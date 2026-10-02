// src/lib/post-image.ts
import { siteConfig } from '@/src/config/site';
import { withBasePath } from '@/src/lib/base-path';

type PostImageSource = { slug: string; image?: string };

/**
 * 記事のサムネイル画像パス（basePath 付き）を返す。フロントマターの `image` がなければ動的 OGP 画像を使う。
 * `next/image` は src に basePath を自動付与しないため、ここで付与する。
 */
export function getPostImagePath(post: PostImageSource): string {
  return withBasePath(post.image ? `/images/${post.image}` : `/og/${post.slug}/image.png`);
}

/**
 * 記事のサムネイル画像の絶対 URL を返す（OGP・構造化データ用）。
 */
export function getPostImageUrl(post: PostImageSource): string {
  return `${siteConfig.origin}${getPostImagePath(post)}`;
}
