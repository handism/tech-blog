import { getAllPosts } from '@/src/lib/posts-server';
import { siteConfig } from '@/src/config/site';

export const revalidate = siteConfig.rss.revalidateSeconds; // 1時間ごとに再検証

export async function GET() {
  const posts = getAllPosts();
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
  <title>${siteConfig.rss.title}</title>
  <link>${baseUrl}</link>
  <description>${siteConfig.rss.description}</description>
  ${rssItems}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
