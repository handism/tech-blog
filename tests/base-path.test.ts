// tests/base-path.test.ts
import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/src/config/site';
import { withBasePath } from '@/src/lib/base-path';

const { basePath } = siteConfig;

describe('withBasePath', () => {
  it('ルート相対パスに basePath を付与する', () => {
    expect(withBasePath('/images/foo.webp')).toBe(`${basePath}/images/foo.webp`);
    expect(withBasePath('/')).toBe(`${basePath}/`);
  });

  it('付与済みのパスは二重に付与しない', () => {
    expect(withBasePath(`${basePath}/images/foo.webp`)).toBe(`${basePath}/images/foo.webp`);
    expect(withBasePath(basePath)).toBe(basePath);
  });

  it('外部 URL・プロトコル相対 URL・相対パス・アンカーはそのまま返す', () => {
    expect(withBasePath('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(withBasePath('//example.com/a.png')).toBe('//example.com/a.png');
    expect(withBasePath('images/foo.webp')).toBe('images/foo.webp');
    expect(withBasePath('#section')).toBe('#section');
  });
});
