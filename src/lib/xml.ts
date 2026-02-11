// src/lib/xml.ts
type RssItem = {
  title: string;
  link: string;
  pubDate?: string;
};

type RssChannel = {
  title: string;
  link: string;
  description: string;
  items: RssItem[];
};

/**
 * XML本文で安全に扱えるように文字をエスケープする。
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * RSS XMLを組み立てる。
 */
export function buildRssXml(channel: RssChannel): string {
  const itemsXml = channel.items
    .map((item) => {
      const pubDateXml = item.pubDate ? `<pubDate>${escapeXml(item.pubDate)}</pubDate>` : '';
      return `<item><title>${escapeXml(item.title)}</title><link>${escapeXml(item.link)}</link>${pubDateXml}</item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(
    channel.title
  )}</title><link>${escapeXml(channel.link)}</link><description>${escapeXml(
    channel.description
  )}</description>${itemsXml}</channel></rss>`;
}

/**
 * Sitemap XMLを組み立てる。
 */
export function buildSitemapXml(urls: string[]): string {
  const urlXml = urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlXml}</urlset>`;
}
