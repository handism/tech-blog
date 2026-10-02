// tests/post-image.test.ts
import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/src/config/site';
import { getPostImagePath, getPostImageUrl } from '@/src/lib/post-image';

describe('getPostImagePath', () => {
  it('image 指定があれば /images/ 配下を basePath 付きで返す', () => {
    expect(getPostImagePath({ slug: 'foo', image: 'foo.webp' })).toBe(
      `${siteConfig.basePath}/images/foo.webp`
    );
  });

  it('image 未指定なら動的 OGP 画像を basePath 付きで返す', () => {
    expect(getPostImagePath({ slug: 'foo' })).toBe(`${siteConfig.basePath}/og/foo/image.png`);
  });
});

describe('getPostImageUrl', () => {
  it('サイト URL を前置した絶対 URL を返す', () => {
    expect(getPostImageUrl({ slug: 'foo' })).toBe(`${siteConfig.url}/og/foo/image.png`);
  });
});
