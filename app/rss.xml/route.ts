import { getAllPosts } from '@/lib/posts-server';

export const revalidate = 3600; // 1時間ごとに再検証

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = 'https://yourdomain.com';

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
  <title>Your Blog</title>
  <link>${baseUrl}</link>
  <description>最新記事一覧</description>
  ${rssItems}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
