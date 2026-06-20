// src/lib/markdown-repository.ts
import fs from 'fs/promises';
import path from 'path';

export type MarkdownSource = {
  slug: string;
  raw: string;
};

export interface MarkdownRepository {
  readAllSources(): Promise<MarkdownSource[]>;
  readSourceBySlug(slug: string): Promise<MarkdownSource | null>;
}

/**
 * 指定されたディレクトリから Markdown ファイルを読み込むリポジトリを作成する。
 */
export function createMarkdownRepository(dirPath: string): MarkdownRepository {
  return {
    async readAllSources() {
      const files = await fs.readdir(dirPath, { withFileTypes: true });
      const markdownFiles = files.filter(
        (dirent) => dirent.isFile() && dirent.name.endsWith('.md')
      );
      return Promise.all(
        markdownFiles.map(async (file) => {
          const slug = file.name.replace(/\.md$/, '');
          const fullPath = path.join(dirPath, file.name);
          const raw = await fs.readFile(fullPath, 'utf8');
          return { slug, raw };
        })
      );
    },
    async readSourceBySlug(slug: string) {
      const fullPath = path.join(dirPath, `${slug}.md`);
      try {
        const raw = await fs.readFile(fullPath, 'utf8');
        return { slug, raw };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    },
  };
}
