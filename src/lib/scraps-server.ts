// src/lib/scraps-server.ts
import { createScrapMeta, parseScrapSource } from '@/src/lib/scrap-parser';
import { readAllScrapSources } from '@/src/lib/scrap-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { Scrap, ScrapMeta } from '@/src/types/scrap';
import { cache } from 'react';

function sortByDate<T extends { date?: Date }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
}

/**
 * 全スクラップのメタ情報を取得（軽量・一覧用）。
 */
export const getAllScrapMeta = cache(async function getAllScrapMeta(): Promise<ScrapMeta[]> {
  const isDev = process.env.NODE_ENV !== 'production';
  const sources = await readAllScrapSources();
  const scraps = sources.map(({ slug, raw }) => {
    const { data, content } = parseScrapSource(raw);
    return createScrapMeta(slug, data, content);
  });
  const filtered = isDev ? scraps : scraps.filter((s) => !s.draft);
  return sortByDate(filtered);
});

/**
 * 全スクラップを本文HTML付きで取得（フィードページ用）。
 */
export const getAllScraps = cache(async function getAllScraps(): Promise<Scrap[]> {
  const isDev = process.env.NODE_ENV !== 'production';
  const sources = await readAllScrapSources();
  const scraps = await Promise.all(
    sources.map(async ({ slug, raw }) => {
      const { data, content } = parseScrapSource(raw);
      const meta = createScrapMeta(slug, data, content);
      const { html } = await renderPostMarkdown(content);
      return { ...meta, content: html };
    })
  );
  const filtered = isDev ? scraps : scraps.filter((s) => !s.draft);
  return sortByDate(filtered);
});
