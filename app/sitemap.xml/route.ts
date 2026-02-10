// app/sitemap.xml/route.ts
import { getAllPosts } from '@/src/lib/posts-server';
import { siteConfig } from '@/src/config/site';

/**
 * サイトマップの再検証間隔（秒）。
 */
export const revalidate = 3600; // 1時間ごとに再検証

/**
 * サイトマップXMLを生成して返す。
 */
export async function GET() {
  const baseUrl = siteConfig.url;
  const posts = await getAllPosts();

  const urls = posts.map((post) => `<url><loc>${baseUrl}/posts/${post.slug}</loc></url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${baseUrl}</loc></url>
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
