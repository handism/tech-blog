// src/lib/scrap-repository.ts
import { siteConfig } from '@/src/config/site';
import path from 'path';
import { createMarkdownRepository, type MarkdownSource } from './markdown-repository';

const scrapsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), siteConfig.scraps.dir);
const repo = createMarkdownRepository(scrapsDir);

/**
 * スクラップディレクトリから全Markdownファイルの生データを取得する。
 */
export async function readAllScrapSources(): Promise<MarkdownSource[]> {
  return repo.readAllSources();
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readScrapSourceBySlug(slug: string): Promise<MarkdownSource | null> {
  return repo.readSourceBySlug(slug);
}
