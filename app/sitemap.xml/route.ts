// app/sitemap.xml/route.ts
import { siteConfig } from '@/src/config/site';
import { getAllPostMeta } from '@/src/lib/posts-server';
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

  const sitemap = buildSitemapXml([
    baseUrl,
    ...posts.map((post) => `${baseUrl}/blog/posts/${post.slug}`),
  ]);

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
