import { describe, expect, it } from 'vitest';
import { buildRssXml, buildSitemapXml, escapeXml } from '@/src/lib/xml';

describe('escapeXml', () => {
  it('should escape special XML characters', () => {
    expect(escapeXml('&')).toBe('&amp;');
    expect(escapeXml('<')).toBe('&lt;');
    expect(escapeXml('>')).toBe('&gt;');
    expect(escapeXml('"')).toBe('&quot;');
    expect(escapeXml("'")).toBe('&apos;');
  });

  it('should handle strings with multiple special characters', () => {
    expect(escapeXml('<tag attr="value"> & \'test\'')).toBe(
      '&lt;tag attr=&quot;value&quot;&gt; &amp; &apos;test&apos;'
    );
  });

  it('should return plain text as is', () => {
    expect(escapeXml('Hello World')).toBe('Hello World');
  });
});

describe('buildRssXml', () => {
  it('should build RSS XML with no items', () => {
    const channel = {
      title: 'My Blog',
      link: 'https://example.com',
      description: 'A blog about testing',
      items: [],
    };
    const expected = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>My Blog</title><link>https://example.com</link><description>A blog about testing</description></channel></rss>`;
    expect(buildRssXml(channel)).toBe(expected);
  });

  it('should build RSS XML with items containing only required fields', () => {
    const channel = {
      title: 'My Blog',
      link: 'https://example.com',
      description: 'A blog about testing',
      items: [
        {
          title: 'First Post',
          link: 'https://example.com/first',
        },
      ],
    };
    const expected = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>My Blog</title><link>https://example.com</link><description>A blog about testing</description><item><title>First Post</title><link>https://example.com/first</link></item></channel></rss>`;
    expect(buildRssXml(channel)).toBe(expected);
  });

  it('should build RSS XML with items containing optional fields', () => {
    const channel = {
      title: 'My Blog',
      link: 'https://example.com',
      description: 'A blog about testing',
      items: [
        {
          title: 'First Post',
          link: 'https://example.com/first',
          pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT',
          description: 'This is the first post.',
        },
      ],
    };
    const expected = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>My Blog</title><link>https://example.com</link><description>A blog about testing</description><item><title>First Post</title><link>https://example.com/first</link><pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate><description>This is the first post.</description></item></channel></rss>`;
    expect(buildRssXml(channel)).toBe(expected);
  });

  it('should properly escape XML characters in channel and item fields', () => {
    const channel = {
      title: '<My Blog>',
      link: 'https://example.com?a=1&b=2',
      description: 'Blog & "testing"',
      items: [
        {
          title: '<First Post>',
          link: 'https://example.com/first?a=1&b=2',
          description: 'This is "first" & \'best\'.',
        },
      ],
    };
    const expected = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>&lt;My Blog&gt;</title><link>https://example.com?a=1&amp;b=2</link><description>Blog &amp; &quot;testing&quot;</description><item><title>&lt;First Post&gt;</title><link>https://example.com/first?a=1&amp;b=2</link><description>This is &quot;first&quot; &amp; &apos;best&apos;.</description></item></channel></rss>`;
    expect(buildRssXml(channel)).toBe(expected);
  });
});

describe('buildSitemapXml', () => {
  it('should build Sitemap XML with simple URL strings', () => {
    const urls = ['https://example.com', 'https://example.com/about'];
    const expected = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com</loc></url><url><loc>https://example.com/about</loc></url></urlset>`;
    expect(buildSitemapXml(urls)).toBe(expected);
  });

  it('should build Sitemap XML with SitemapUrl objects', () => {
    const urls = [
      { loc: 'https://example.com', lastmod: '2024-01-01' },
      { loc: 'https://example.com/about' }, // no lastmod
    ];
    const expected = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com</loc><lastmod>2024-01-01</lastmod></url><url><loc>https://example.com/about</loc></url></urlset>`;
    expect(buildSitemapXml(urls)).toBe(expected);
  });

  it('should properly escape XML characters in URLs', () => {
    const urls = ['https://example.com?a=1&b=2'];
    const expected = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.com?a=1&amp;b=2</loc></url></urlset>`;
    expect(buildSitemapXml(urls)).toBe(expected);
  });
});
