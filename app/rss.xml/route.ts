// app/rss.xml/route.ts
import { siteConfig } from '@/src/config/site';
import { getAllPosts } from '@/src/lib/posts-server';

/**
 * RSSの再検証間隔（秒）。
 */
export const revalidate = 3600; // 1時間ごとに再検証

/**
 * RSSフィードXMLを生成して返す。
 */
export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = siteConfig.url;

  const rssItems = posts
    .map(
      (post) => `
<item>
  <title>${post.title}</title>
  <link>${baseUrl}/posts/${post.slug}</link>
  <pubDate>${post.date?.toUTCString()}</pubDate>
</item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>${siteConfig.name}</title>
  <link>${baseUrl}</link>
  <description>${siteConfig.description}</description>
  ${rssItems}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
