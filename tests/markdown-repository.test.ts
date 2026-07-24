// tests/markdown-repository.test.ts
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { createMarkdownRepository } from '@/src/lib/markdown-repository';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('createMarkdownRepository', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'md-repo-test-'));
    // テスト用ファイルを作成
    await fs.writeFile(path.join(tmpDir, 'hello.md'), '---\ntitle: Hello\n---\nHello World');
    await fs.writeFile(path.join(tmpDir, 'world.md'), '---\ntitle: World\n---\nWorld Content');
    await fs.writeFile(path.join(tmpDir, 'not-markdown.txt'), 'I am not markdown');
    await fs.mkdir(path.join(tmpDir, 'subdir'));
    await fs.writeFile(path.join(tmpDir, 'subdir', 'nested.md'), 'nested content');
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  describe('readAllSources', () => {
    it('.md ファイルのみを読み取る', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const sources = await repo.readAllSources();

      const slugs = sources.map((s) => s.slug).sort();
      expect(slugs).toEqual(['hello', 'world']);
    });

    it('.txt ファイルやサブディレクトリを無視する', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const sources = await repo.readAllSources();

      expect(sources.every((s) => !s.slug.includes('not-markdown'))).toBe(true);
      expect(sources.every((s) => !s.slug.includes('subdir'))).toBe(true);
    });

    it('各ソースに slug と raw を含む', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const sources = await repo.readAllSources();

      const hello = sources.find((s) => s.slug === 'hello');
      expect(hello).toBeDefined();
      expect(hello!.raw).toContain('Hello World');
      expect(hello!.raw).toContain('title: Hello');
    });
  });

  describe('readSourceBySlug', () => {
    it('存在するスラッグのソースを返す', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('hello');

      expect(source).not.toBeNull();
      expect(source!.slug).toBe('hello');
      expect(source!.raw).toContain('Hello World');
    });

    it('存在しないスラッグに対して null を返す', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('nonexistent');

      expect(source).toBeNull();
    });

    it('パストラバーサル攻撃 ("../") を防ぐ', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('../etc/passwd');

      expect(source).toBeNull();
    });

    it('パストラバーサル攻撃 ("../../") を防ぐ', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('../../secret');

      expect(source).toBeNull();
    });

    it('絶対パスのスラッグを拒否する', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('/etc/passwd');

      expect(source).toBeNull();
    });

    it('サブディレクトリ内のファイルはスラッシュ含みスラッグで読み取れる', async () => {
      const repo = createMarkdownRepository(tmpDir);
      const source = await repo.readSourceBySlug('subdir/nested');

      // subdir/nested.md は dirPath 配下にあり、path.relative が ".." で始まらないので読み取り可
      expect(source).not.toBeNull();
      expect(source!.raw).toBe('nested content');
    });
  });
});
