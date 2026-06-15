// tests/post-parser.test.ts
import { describe, expect, it } from 'vitest';
import { createPostMeta, parsePostSource } from '@/src/lib/post-parser';

describe('parsePostSource', () => {
  it('正常なfrontmatterを正しく解析する', () => {
    const raw = `---
title: テスト記事
date: 2024-01-15
tags: [Vue, TypeScript]
category: Frontend
image: test.webp
---
本文
`;
    const { data, content } = parsePostSource(raw);
    expect(data.title).toBe('テスト記事');
    expect(data.date).toBeInstanceOf(Date);
    expect(data.date?.toISOString()).toContain('2024-01-15');
    expect(data.tags).toEqual(['Vue', 'TypeScript']);
    expect(data.category).toBe('Frontend');
    expect(data.image).toBe('test.webp');
    expect(content.trim()).toBe('本文');
  });

  it('titleが空のときデフォルト値にフォールバックする', () => {
    const raw = `---
title: ''
category: IT
---
`;
    const { data } = parsePostSource(raw);
    expect(data.title).toBeTruthy();
  });

  it('titleがないときデフォルト値にフォールバックする', () => {
    const raw = `---
category: IT
---
`;
    const { data } = parsePostSource(raw);
    expect(data.title).toBeTruthy();
  });

  it('tagsがないとき空配列になる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parsePostSource(raw);
    expect(data.tags).toEqual([]);
  });

  it('tagsが不正な値のとき空配列にフォールバックする', () => {
    const raw = `---
title: テスト
tags: not-an-array
---
`;
    const { data } = parsePostSource(raw);
    expect(Array.isArray(data.tags)).toBe(true);
  });

  it('dateが文字列でも Dateオブジェクトに変換する', () => {
    const raw = `---
title: テスト
date: '2025-06-01'
---
`;
    const { data } = parsePostSource(raw);
    expect(data.date).toBeInstanceOf(Date);
  });

  it('dateがないときundefinedになる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parsePostSource(raw);
    expect(data.date).toBeUndefined();
  });

  it('imageがないときundefinedになる', () => {
    const raw = `---
title: テスト
---
`;
    const { data } = parsePostSource(raw);
    expect(data.image).toBeUndefined();
  });

  it('frontmatterが完全に空のときデフォルト値が使われる', () => {
    const raw = `---
---
本文
`;
    const { data, content } = parsePostSource(raw);
    expect(data.title).toBeTruthy();
    expect(data.tags).toEqual([]);
    expect(data.category).toBeTruthy();
    expect(content.trim()).toBe('本文');
  });
});

describe('createPostMeta', () => {
  it('スラッグ・frontmatter・本文からメタ情報を生成する', () => {
    const { data } = parsePostSource(`---
title: タイトル
date: 2024-03-01
tags: [React, Blog]
category: Frontend
---
本文テキスト
`);
    const meta = createPostMeta('my-slug', data, '本文テキスト');
    expect(meta.slug).toBe('my-slug');
    expect(meta.title).toBe('タイトル');
    expect(meta.tags).toEqual(['React', 'Blog']);
    expect(meta.category).toBe('Frontend');
    expect(meta.plaintext).toContain('本文テキスト');
    expect(meta.description).toBe('本文テキスト');
    expect(meta.readingMinutes).toBe(1);
  });

  it('plaintext にマークダウン記法が含まれない', () => {
    const { data } = parsePostSource(`---
title: テスト
---
`);
    const markdown = `## 見出し\n**太字** と \`コード\` と [リンク](https://example.com)`;
    const meta = createPostMeta('slug', data, markdown);
    expect(meta.plaintext).not.toContain('##');
    expect(meta.plaintext).not.toContain('**');
    expect(meta.plaintext).not.toContain('`');
    expect(meta.plaintext).toContain('見出し');
    expect(meta.plaintext).toContain('太字');
    // インラインコードはテキスト内容ごと除去される
    expect(meta.plaintext).not.toContain('コード');
    expect(meta.plaintext).toContain('リンク');
  });

  it('コードブロックをplaintextから除去する', () => {
    const { data } = parsePostSource(`---
title: テスト
---
`);
    const markdown = 'テキスト\n```js\nconst x = 1;\n```\n続き';
    const meta = createPostMeta('slug', data, markdown);
    expect(meta.plaintext).not.toContain('const x = 1');
    expect(meta.plaintext).toContain('テキスト');
    expect(meta.plaintext).toContain('続き');
  });
});
