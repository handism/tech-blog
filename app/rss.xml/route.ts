// app/rss.xml/route.ts
import { siteConfig } from '@/src/config/site';
import { getAllPostMeta } from '@/src/lib/posts-server';
import { buildRssXml } from '@/src/lib/xml';

/**
 * RSSの再検証間隔（秒）。
 */
export const revalidate = 3600; // 1時間ごとに再検証

/**
 * RSSフィードXMLを生成して返す。
 */
export async function GET() {
  const posts = await getAllPostMeta();
  const baseUrl = siteConfig.url;

  const rss = buildRssXml({
    title: siteConfig.name,
    link: baseUrl,
    description: siteConfig.description,
    items: posts.map((post) => ({
      title: post.title,
      link: `${baseUrl}/blog/posts/${post.slug}`,
      pubDate: post.date?.toUTCString(),
    })),
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}
