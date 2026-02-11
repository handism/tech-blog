// src/lib/post-repository.ts
import { siteConfig } from '@/src/config/site';
import fs from 'fs/promises';
import path from 'path';

const postsDir = path.join(process.cwd(), siteConfig.posts.dir);

type PostSource = {
  slug: string;
  raw: string;
};

/**
 * 記事ディレクトリから全Markdown記事の生データを取得する。
 */
export async function readAllPostSources(): Promise<PostSource[]> {
  const files = await fs.readdir(postsDir, { withFileTypes: true });

  const markdownFiles = files.filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'));
  return Promise.all(
    markdownFiles.map(async (file) => {
      const slug = file.name.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, file.name);
      const raw = await fs.readFile(fullPath, 'utf8');
      return { slug, raw };
    })
  );
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export async function readPostSourceBySlug(slug: string): Promise<PostSource | null> {
  const fullPath = path.join(postsDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    return {
      slug,
      raw,
    };
  } catch {
    return null;
  }
}
