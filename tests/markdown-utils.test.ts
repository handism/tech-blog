// tests/markdown-utils.test.ts
import { describe, expect, it } from 'vitest';
import { markdownToPlaintext } from '@/src/lib/markdown-utils';

describe('markdownToPlaintext', () => {
  it('Markdownの装飾記号が除去されプレーンテキストが残ること', () => {
    const markdown = '## 見出し\n**太字** と *斜体* と ~~取り消し~~';
    const plaintext = markdownToPlaintext(markdown);
    expect(plaintext).not.toContain('##');
    expect(plaintext).not.toContain('**');
    expect(plaintext).not.toContain('*');
    expect(plaintext).not.toContain('~~');
    expect(plaintext).toContain('見出し');
    expect(plaintext).toContain('太字');
    expect(plaintext).toContain('斜体');
    expect(plaintext).toContain('取り消し');
  });

  it('リンク記法からテキスト部分のみが残ること', () => {
    const markdown = '[リンクテキスト](https://example.com)';
    const plaintext = markdownToPlaintext(markdown);
    expect(plaintext).not.toContain('(');
    expect(plaintext).not.toContain(')');
    expect(plaintext).not.toContain('https://example.com');
    expect(plaintext).toBe('リンクテキスト');
  });

  it('インラインコード記号が除去されること', () => {
    const markdown = '変数 `x` の値';
    const plaintext = markdownToPlaintext(markdown);
    expect(plaintext).not.toContain('`');
    expect(plaintext).toBe('変数 x の値');
  });

  it('フェンスコードブロックが完全に除去されること', () => {
    const markdown =
      '前段テキスト\n```javascript\nconst x = 1;\nconsole.log(x);\n```\n後段テキスト';
    const plaintext = markdownToPlaintext(markdown);
    expect(plaintext).not.toContain('const x = 1');
    expect(plaintext).not.toContain('console.log');
    expect(plaintext).toContain('前段テキスト');
    expect(plaintext).toContain('後段テキスト');
  });

  it('HTMLタグが除去されること', () => {
    const markdown = '<p>HTMLの段落</p>と<span>スパン</span>';
    const plaintext = markdownToPlaintext(markdown);
    expect(plaintext).not.toContain('<p>');
    expect(plaintext).not.toContain('</p>');
    expect(plaintext).not.toContain('<span>');
    expect(plaintext).toBe('HTMLの段落とスパン');
  });
});
