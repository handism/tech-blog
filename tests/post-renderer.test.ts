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

  it('Mermaidコードブロックをスケルトンおよびコンテナ構造に置換すること', async () => {
    const markdown = '```mermaid\ngraph TD\nA --> B\n```';
    const { html } = await renderPostMarkdown(markdown);
    expect(html).toContain('class="mermaid-container');
    expect(html).toContain('class="mermaid-skeleton');
    expect(html).toContain('class="mermaid opacity-0');
    expect(html).toContain('graph TD\nA --&gt; B');
    expect(html).not.toContain('class="shiki"');
  });

  it('MermaidソースのHTML特殊文字をエスケープし、textContentで復元できること', async () => {
    const source = 'graph TD\n  A["a &amp; b"] -->|"&lt;token&gt;"| B[終端<br/>改行]';
    const { html } = await renderPostMarkdown('```mermaid\n' + source + '\n```');

    // ブラウザに HTML として解釈されうる文字が生のまま残っていないこと
    expect(html).toContain('A["a &amp;amp; b"]');
    expect(html).toContain('&lt;br/&gt;');
    expect(html).not.toContain('<br/>');

    // textContent 相当（エンティティを1段デコード）で元のソースに戻ること
    const rendered = html.slice(
      html.indexOf('class="mermaid opacity-0'),
      html.indexOf('</div>\n</div>')
    );
    const decoded = rendered
      .slice(rendered.indexOf('>') + 1)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    expect(decoded).toBe(source);
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

  it('日本語の「」や句読点に隣接する強調および取り消し線が正しく認識されること', async () => {
    const markdown =
      '個人開発を経験することで**「全体を俯瞰する視野」**が養われます。そして、~~「不要な機能」~~を削除します。';
    const { html } = await renderPostMarkdown(markdown);
    expect(html).toContain('<strong>「全体を俯瞰する視野」</strong>');
    expect(html).toContain('<del>「不要な機能」</del>');
  });
});
