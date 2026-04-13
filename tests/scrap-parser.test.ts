// tests/scrap-parser.test.ts
import { describe, expect, it } from 'vitest';
import { createScrapMeta, parseScrapSource } from '@/src/lib/scrap-parser';

describe('parseScrapSource', () => {
  it('正常なfrontmatterを正しく解析する', () => {
    const raw = `---
title: テストスクラップ
date: 2024-01-15
tags: [Next.js, debug]
draft: false
---
本文
`;
    const { data, content } = parseScrapSource(raw);
    expect(data.title).toBe('テストスクラップ');
    expect(data.date).toBeInstanceOf(Date);
    expect(data.date?.toISOString()).toContain('2024-01-15');
    expect(data.tags).toEqual(['Next.js', 'debug']);
    expect(data.draft).toBe(false);
    expect(content.trim()).toBe('本文');
  });

  it('titleがないときデフォルト値にフォールバックする', () => {
    const raw = `---
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.title).toBeTruthy();
  });

  it('titleが空のときデフォルト値にフォールバックする', () => {
    const raw = `---
title: ''
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.title).toBeTruthy();
  });

  it('tagsがないとき空配列になる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.tags).toEqual([]);
  });

  it('tagsが不正な値のとき空配列にフォールバックする', () => {
    const raw = `---
title: テスト
tags: not-an-array
---
`;
    const { data } = parseScrapSource(raw);
    expect(Array.isArray(data.tags)).toBe(true);
  });

  it('dateが文字列でも Dateオブジェクトに変換する', () => {
    const raw = `---
title: テスト
date: '2025-06-01'
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.date).toBeInstanceOf(Date);
  });

  it('dateがないときundefinedになる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.date).toBeUndefined();
  });

  it('draftがないときundefinedになる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parseScrapSource(raw);
    expect(data.draft).toBeUndefined();
  });

  it('frontmatterが完全に空のときデフォルト値が使われる', () => {
    const raw = `---
---
本文
`;
    const { data, content } = parseScrapSource(raw);
    expect(data.title).toBeTruthy();
    expect(data.tags).toEqual([]);
    expect(content.trim()).toBe('本文');
  });
});

describe('createScrapMeta', () => {
  it('スラッグ・frontmatter・本文からメタ情報を生成する', () => {
    const { data } = parseScrapSource(`---
title: タイトル
date: 2024-03-01
tags: [React, Blog]
---
本文テキスト
`);
    const meta = createScrapMeta('my-slug', data, '本文テキスト');
    expect(meta.slug).toBe('my-slug');
    expect(meta.title).toBe('タイトル');
    expect(meta.tags).toEqual(['React', 'Blog']);
    expect(meta.description).toBe('本文テキスト');
  });

  it('descriptionはMarkdown記法を含まない', () => {
    const { data } = parseScrapSource(`---
title: テスト
---
`);
    const markdown = `## 見出し\n**太字** と \`コード\` と [リンク](https://example.com)`;
    const meta = createScrapMeta('slug', data, markdown);
    expect(meta.description).not.toContain('##');
    expect(meta.description).not.toContain('**');
    expect(meta.description).not.toContain('`');
    expect(meta.description).toContain('見出し');
    expect(meta.description).toContain('太字');
    expect(meta.description).toContain('リンク');
  });

  it('descriptionはコードブロックを含まない', () => {
    const { data } = parseScrapSource(`---
title: テスト
---
`);
    const markdown = 'テキスト\n```js\nconst x = 1;\n```\n続き';
    const meta = createScrapMeta('slug', data, markdown);
    expect(meta.description).not.toContain('const x = 1');
    expect(meta.description).toContain('テキスト');
  });

  it('descriptionは100文字以内に切り詰める', () => {
    const { data } = parseScrapSource(`---
title: テスト
---
`);
    const longContent = 'あ'.repeat(200);
    const meta = createScrapMeta('slug', data, longContent);
    expect(meta.description.length).toBeLessThanOrEqual(100);
  });
});
