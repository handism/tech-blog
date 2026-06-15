// src/lib/scrap-repository.ts
import { siteConfig } from '@/src/config/site';
import fs from 'fs/promises';
import path from 'path';

const scrapsDir = path.join(process.cwd(), siteConfig.scraps.dir);

type ScrapSource = {
  slug: string;
  raw: string;
};

/**
 * スクラップディレクトリから全Markdownファイルの生データを取得する。
 */
export async function readAllScrapSources(): Promise<ScrapSource[]> {
  const files = await fs.readdir(scrapsDir, { withFileTypes: true });

  const markdownFiles = files.filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'));
  return Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.name.replace(/\.md$/, '');
      const fullPath = path.join(scrapsDir, file.name);
      const raw = await fs.readFile(fullPath, 'utf8');
      return { slug, raw };
    })
  );
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readScrapSourceBySlug(slug: string): Promise<ScrapSource | null> {
  const fullPath = path.join(scrapsDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return { slug, raw };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
