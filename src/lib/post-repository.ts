// src/lib/post-repository.ts
import { siteConfig } from '@/src/config/site';
import path from 'path';
import { createMarkdownRepository } from './markdown-repository';

const postsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), siteConfig.posts.dir);
const repo = createMarkdownRepository(postsDir);

type PostSource = {
  slug: string;
  raw: string;
};

/**
 * 記事ディレクトリから全Markdown記事の生データを取得する。
 */
export async function readAllPostSources(): Promise<PostSource[]> {
  return repo.readAllSources();
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readPostSourceBySlug(slug: string): Promise<PostSource | null> {
  return repo.readSourceBySlug(slug);
}
