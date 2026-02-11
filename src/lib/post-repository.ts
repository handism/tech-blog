import { siteConfig } from '@/src/config/site';
import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), siteConfig.posts.dir);

type PostSource = {
  slug: string;
  raw: string;
};

/**
 * 記事ディレクトリから全Markdown記事の生データを取得する。
 */
export function readAllPostSources(): PostSource[] {
  const files = fs.readdirSync(postsDir, { withFileTypes: true });

  return files
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.md'))
    .map((file) => {
      const slug = file.name.replace(/\.md$/, '');
      const fullPath = path.join(postsDir, file.name);
      const raw = fs.readFileSync(fullPath, 'utf8');
      return { slug, raw };
    });
}

/**
 * 指定スラッグのMarkdown生データを取得する。存在しなければnullを返す。
 */
export function readPostSourceBySlug(slug: string): PostSource | null {
  const fullPath = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  return {
    slug,
    raw: fs.readFileSync(fullPath, 'utf8'),
  };
}
