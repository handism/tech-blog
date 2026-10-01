// src/lib/post-image.ts
import { siteConfig } from '@/src/config/site';

type PostImageSource = { slug: string; image?: string };

/**
 * 記事のサムネイル画像パスを返す。フロントマターの `image` がなければ動的 OGP 画像を使う。
 */
export function getPostImagePath(post: PostImageSource): string {
  return post.image ? `/images/${post.image}` : `/og/${post.slug}/image.png`;
}

/**
 * 記事のサムネイル画像の絶対 URL を返す（OGP・構造化データ用）。
 */
export function getPostImageUrl(post: PostImageSource): string {
  return `${siteConfig.url}${getPostImagePath(post)}`;
}
