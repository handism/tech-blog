// src/lib/xml.ts
type RssItem = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
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
 * 値が存在する場合のみ XML 要素文字列を返す。
 */
function xmlOptElement(tag: string, value: string | undefined): string {
  return value ? `<${tag}>${escapeXml(value)}</${tag}>` : '';
}

/**
 * RSS XMLを組み立てる。
 */
export function buildRssXml(channel: RssChannel): string {
  const itemsXml = channel.items
    .map((item) => {
      return `<item><title>${escapeXml(item.title)}</title><link>${escapeXml(item.link)}</link>${xmlOptElement('pubDate', item.pubDate)}${xmlOptElement('description', item.description)}</item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(
    channel.title
  )}</title><link>${escapeXml(channel.link)}</link><description>${escapeXml(
    channel.description
  )}</description>${itemsXml}</channel></rss>`;
}

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

/**
 * Sitemap XMLを組み立てる。
 */
export function buildSitemapXml(urls: (string | SitemapUrl)[]): string {
  const urlXml = urls
    .map((url) => {
      if (typeof url === 'string') {
        return `<url><loc>${escapeXml(url)}</loc></url>`;
      }
      const lastmodXml = url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : '';
      return `<url><loc>${escapeXml(url.loc)}</loc>${lastmodXml}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlXml}</urlset>`;
}
