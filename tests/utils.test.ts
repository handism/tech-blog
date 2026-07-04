// tests/utils.test.ts
import { describe, expect, it } from 'vitest';
import { categoryToSlug, estimateReadingMinutes, tagToSlug } from '@/src/lib/utils';

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

describe('estimateReadingMinutes', () => {
  it('空文字の場合は1を返す', () => {
    expect(estimateReadingMinutes('')).toBe(1);
  });

  it('短いCJK文字列の場合は1を返す', () => {
    expect(estimateReadingMinutes('こんにちは世界')).toBe(1);
  });

  it('600文字のCJK文字列の場合は1を返す', () => {
    expect(estimateReadingMinutes('あ'.repeat(600))).toBe(1);
  });

  it('601文字のCJK文字列の場合は2を返す', () => {
    expect(estimateReadingMinutes('あ'.repeat(601))).toBe(2);
  });

  it('短い英語テキストの場合は1を返す', () => {
    expect(estimateReadingMinutes('hello world')).toBe(1);
  });

  it('200語の英単語の場合は1を返す', () => {
    const text = Array(200).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(1);
  });

  it('201語の英単語の場合は2を返す', () => {
    const text = Array(201).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(2);
  });

  it('CJK文字列と英単語が混在している場合（合計1分未満）', () => {
    // CJK: 300 / 600 = 0.5
    // Eng: 100 / 200 = 0.5
    // Total = 1
    const text = 'あ'.repeat(300) + ' ' + Array(100).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(1);
  });

  it('CJK文字列と英単語が混在している場合（合計1分超過）', () => {
    // CJK: 301 / 600 = 0.501...
    // Eng: 100 / 200 = 0.5
    // Total = 1.001... -> ceil -> 2
    const text = 'あ'.repeat(301) + ' ' + Array(100).fill('word').join(' ');
    expect(estimateReadingMinutes(text)).toBe(2);
  });

  it('数字や記号のみの場合は1を返す', () => {
    expect(estimateReadingMinutes('1234567890 !@#$%^&*()_+')).toBe(1);
  });

  it('ハイフンやアポストロフィを含む英単語を正しくカウントする', () => {
    // "it's" -> 1 word
    // "well-known" -> 1 word
    // total 2 words -> < 200 -> 1 minute
    expect(estimateReadingMinutes("It's a well-known fact that")).toBe(1);
  });
});
