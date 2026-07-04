import { describe, expect, it } from 'vitest';
import { escapeXml } from '@/src/lib/xml';

describe('escapeXml', () => {
  it('エスケープ不要な文字列はそのまま返す', () => {
    expect(escapeXml('Hello World')).toBe('Hello World');
  });

  it('& をエスケープする', () => {
    expect(escapeXml('A & B')).toBe('A &amp; B');
  });

  it('< をエスケープする', () => {
    expect(escapeXml('1 < 2')).toBe('1 &lt; 2');
  });

  it('> をエスケープする', () => {
    expect(escapeXml('2 > 1')).toBe('2 &gt; 1');
  });

  it('" をエスケープする', () => {
    expect(escapeXml('Hello "World"')).toBe('Hello &quot;World&quot;');
  });

  it("' をエスケープする", () => {
    expect(escapeXml("It's a beautiful day")).toBe('It&apos;s a beautiful day');
  });

  it('複数の特殊文字が混ざっている場合、全てエスケープする', () => {
    expect(escapeXml('<tag attr="value" data=\'test\'> & content >')).toBe(
      '&lt;tag attr=&quot;value&quot; data=&apos;test&apos;&gt; &amp; content &gt;'
    );
  });

  it('空文字の場合は空文字を返す', () => {
    expect(escapeXml('')).toBe('');
  });
});
