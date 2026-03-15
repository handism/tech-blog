// app/sitemap.xml/route.ts
import { siteConfig } from '@/src/config/site';
import { getAllTags } from '@/src/lib/post-taxonomy';
import { getAllPostMeta } from '@/src/lib/posts-server';
import { getBlogViewContext, paginatePosts } from '@/src/lib/posts-view';
import { categoryToSlug, tagToSlug } from '@/src/lib/utils';
import { buildSitemapXml } from '@/src/lib/xml';

/**
 * サイトマップの再検証間隔（秒）。
 */
export const revalidate = 3600; // 1時間ごとに再検証

/**
 * サイトマップXMLを生成して返す。
 */
export async function GET() {
  const baseUrl = siteConfig.url;
  const posts = await getAllPostMeta();
  const { categories } = await getBlogViewContext();
  const tags = getAllTags(posts);
  const { totalPages } = paginatePosts(posts, 1, siteConfig.pagination.postsPerPage);
  const today = new Date().toISOString().split('T')[0];

  const sitemap = buildSitemapXml([
    { loc: baseUrl, lastmod: today },
    ...posts.map((post) => ({
      loc: `${baseUrl}/blog/posts/${post.slug}`,
      lastmod: post.date ? post.date.toISOString().split('T')[0] : undefined,
    })),
    ...categories.map((category) => ({
      loc: `${baseUrl}/blog/categories/${categoryToSlug(category)}`,
    })),
    ...tags.map((tag) => ({
      loc: `${baseUrl}/blog/tags/${tagToSlug(tag)}`,
    })),
    ...Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      loc: `${baseUrl}/blog/page/${i + 2}`,
    })),
  ]);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
