// app/sitemap.xml/route.ts
import { getAllPosts } from '@/src/lib/posts-server';
import { siteConfig } from '@/src/config/site';

export const revalidate = 3600; // 1時間ごとに再検証

export async function GET() {
  const baseUrl = siteConfig.url;
  const posts = getAllPosts();

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
