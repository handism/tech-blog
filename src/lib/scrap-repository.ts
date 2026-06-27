// src/lib/scrap-repository.ts
import { siteConfig } from '@/src/config/site';
import path from 'path';
import { createMarkdownRepository } from './markdown-repository';

const scrapsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), siteConfig.scraps.dir);
const repo = createMarkdownRepository(scrapsDir);

type ScrapSource = {
  slug: string;
  raw: string;
};

/**
 * スクラップディレクトリから全Markdownファイルの生データを取得する。
 */
export async function readAllScrapSources(): Promise<ScrapSource[]> {
  return repo.readAllSources();
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readScrapSourceBySlug(slug: string): Promise<ScrapSource | null> {
  return repo.readSourceBySlug(slug);
}
