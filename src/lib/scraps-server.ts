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
  return await processMetadataList(sources, async (slug, raw) => {
    const { data, content } = parseScrapSource(raw);
    return createScrapMeta(slug, data, content);
  });
});

/**
 * 全スクラップを本文HTML付きで取得（フィードページ用）。
 * ドラフト除外・日付ソートをHTMLレンダリングより先に実施し、無駄な処理を省く。
 */
export const getAllScraps = cache(async function getAllScraps(): Promise<Scrap[]> {
  const sources = await readAllScrapSources();

  // まずメタ情報のみ生成し、ドラフト除外・日付ソートを先に実施
  const parsed = sources.map(({ slug, raw }) => {
    const { data, content } = parseScrapSource(raw);
    return { meta: createScrapMeta(slug, data, content), content };
  });
  const slugOrder = sortByDate(filterDrafts(parsed.map((p) => p.meta))).map((m) => m.slug);
  const parsedBySlug = new Map(parsed.map((p) => [p.meta.slug, p]));

  // 可視スクラップのみHTMLをレンダリング
  return Promise.all(
    slugOrder.map(async (slug) => {
      const { meta, content } = parsedBySlug.get(slug)!;
      const { html } = await renderPostMarkdown(content);
      return { ...meta, content: html };
    })
  );
});
