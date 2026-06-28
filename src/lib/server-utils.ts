import fs from 'fs/promises';
import { filterDrafts, sortByDate } from './utils';

/**
 * ファイルまたはディレクトリが存在するかどうかを判定する。
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Markdownソースリストをパースし、下書きを除外して日付順で降順ソートする共通ヘルパー。
 */
export async function processMetadataList<
  TSource extends { slug: string; raw: string },
  TMeta extends { date?: Date; draft?: boolean },
>(
  sources: TSource[],
  parseAndCreateMeta: (slug: string, raw: string) => Promise<TMeta>
): Promise<TMeta[]> {
  const items = await Promise.all(sources.map(({ slug, raw }) => parseAndCreateMeta(slug, raw)));
  const filtered = filterDrafts(items);
  return sortByDate(filtered);
}
