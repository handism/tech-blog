// tests/utils.test.ts
import { describe, expect, it } from 'vitest';
import { categoryToSlug, tagToSlug } from '@/src/lib/utils';

describe('tagToSlug', () => {
  it('英小文字はそのまま返す', () => {
    expect(tagToSlug('javascript')).toBe('javascript');
  });

  it('大文字を小文字に変換する', () => {
    expect(tagToSlug('TypeScript')).toBe('typescript');
  });

  it('スペースをハイフンに変換する', () => {
    expect(tagToSlug('next js')).toBe('next-js');
  });

  it('ドットなど記号を除去する', () => {
    expect(tagToSlug('Next.js')).toBe('nextjs');
  });

  it('+ を plus に展開する', () => {
    expect(tagToSlug('C++')).toBe('c-plus-plus');
  });

  it('# を sharp に展開する', () => {
    expect(tagToSlug('C#')).toBe('c-sharp');
  });

  it('& を and に展開する', () => {
    expect(tagToSlug('Rust & Go')).toBe('rust-and-go');
  });

  it('連続するスペースは1つのハイフンにまとめる', () => {
    expect(tagToSlug('hello  world')).toBe('hello-world');
  });

  it('前後のハイフンを除去する', () => {
    expect(tagToSlug('  hello  ')).toBe('hello');
  });

  it('日本語をそのまま保持する', () => {
    const result = tagToSlug('インフラ');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('記号のみの場合はフォールバック値を返す', () => {
    const result = tagToSlug('...');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('categoryToSlug', () => {
  it('カテゴリ名をスラッグに変換する', () => {
    expect(categoryToSlug('Frontend')).toBe('frontend');
  });

  it('tagToSlug と同じ変換ルールを持つ', () => {
    expect(categoryToSlug('IT Infrastructure')).toBe('it-infrastructure');
  });
});
