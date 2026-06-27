// src/lib/scraps-server.ts
import { createScrapMeta, parseScrapSource } from '@/src/lib/scrap-parser';
import { readAllScrapSources } from '@/src/lib/scrap-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { Scrap, ScrapMeta } from '@/src/types/scrap';
import { filterDrafts, sortByDate } from '@/src/lib/utils';
import { processMetadataList } from '@/src/lib/server-utils';
import { cache } from 'react';

/**
 * 全スクラップのメタ情報を取得（軽量・一覧用）。
 */
export const getAllScrapMeta = cache(async function getAllScrapMeta(): Promise<ScrapMeta[]> {
  const sources = await readAllScrapSources();
  return processMetadataList(sources, (slug, raw) => {
    const { data, content } = parseScrapSource(raw);
    return createScrapMeta(slug, data, content);
  });
});

/**
 * 全スクラップを本文HTML付きで取得（フィードページ用）。
 */
export const getAllScraps = cache(async function getAllScraps(): Promise<Scrap[]> {
  const sources = await readAllScrapSources();
  const scraps = await Promise.all(
    sources.map(async ({ slug, raw }) => {
      const { data, content } = parseScrapSource(raw);
      const meta = createScrapMeta(slug, data, content);
      const { html } = await renderPostMarkdown(content);
      return { ...meta, content: html };
    })
  );
  const filtered = filterDrafts(scraps);
  return sortByDate(filtered);
});
