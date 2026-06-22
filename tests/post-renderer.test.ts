// tests/post-renderer.test.ts
import { describe, expect, it } from 'vitest';
import { renderPostMarkdown } from '@/src/lib/post-renderer';

describe('renderPostMarkdown', () => {
  it('基本的なMarkdownをHTMLに変換できること', async () => {
    const markdown = '# Hello World\nこれはテストです。';
    const { html, toc } = await renderPostMarkdown(markdown);
    expect(html).toContain('<h1 id="hello-world"><a href="#hello-world">Hello World</a></h1>');
    expect(html).toContain('これはテストです。');
    expect(toc.length).toBe(1);
    expect(toc[0].text).toBe('Hello World');
  });

  it('コードブロックのファイル名指定から data-filename を抽出できること', async () => {
    const markdown = '```ts:test.ts\nconst a = 1;\n```';
    const { html } = await renderPostMarkdown(markdown);
    expect(html).toContain('data-filename="test.ts"');
    expect(html).toContain('data-language="ts"');
  });

  it('Mermaidコードブロックを生の div.mermaid に置換すること', async () => {
    const markdown = '```mermaid\ngraph TD\nA --> B\n```';
    const { html } = await renderPostMarkdown(markdown);
    expect(html).toContain('<div class="mermaid">graph TD\nA --> B</div>');
    expect(html).not.toContain('class="shiki"');
  });

  it('画像サイズ自動付与において、外部URLやデータURLはスキップされること', async () => {
    // 外部URLの画像
    const markdown1 = '![外部画像](https://example.com/image.png)';
    const { html: html1 } = await renderPostMarkdown(markdown1);
    expect(html1).toContain('src="https://example.com/image.png"');
    expect(html1).not.toContain('width=');

    // データURLの画像
    const markdown2 =
      '![データ画像](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==)';
    const { html: html2 } = await renderPostMarkdown(markdown2);
    expect(html2).toContain('src="data:image/png;base64,');
    expect(html2).not.toContain('width=');
  });
});
