// src/lib/scraps-server.ts
import { createScrapMeta, parseScrapSource } from '@/src/lib/scrap-parser';
import { readAllScrapSources, readScrapSourceBySlug } from '@/src/lib/scrap-repository';
import { renderPostMarkdown } from '@/src/lib/post-renderer';
import type { Scrap, ScrapMeta } from '@/src/types/scrap';
import { cache } from 'react';

/**
 * スラッグからソースを読み込み、メタ情報と本文を返す内部ヘルパー。
 */
const _loadAndParseScrapMeta = cache(async function _loadAndParseScrapMeta(
  slug: string
): Promise<{ meta: ScrapMeta; content: string } | null> {
  const source = await readScrapSourceBySlug(slug);
  if (!source) return null;
  const { data, content } = parseScrapSource(source.raw);
  return { meta: createScrapMeta(slug, data, content), content };
});

/**
 * 全スクラップのメタ情報を取得（一覧用）。
 */
export const getAllScrapMeta = cache(async function getAllScrapMeta(): Promise<ScrapMeta[]> {
  const isDev = process.env.NODE_ENV !== 'production';
  const sources = await readAllScrapSources();
  const scraps = sources.map(({ slug, raw }) => {
    const { data, content } = parseScrapSource(raw);
    return createScrapMeta(slug, data, content);
  });

  // 本番ビルド時は draft: true のスクラップを除外する
  const filtered = isDev ? scraps : scraps.filter((s) => !s.draft);

  return filtered.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
});

/**
 * 単スクラップのメタ情報のみを取得（メタデータ生成用）。
 */
export const getScrapMetaBySlug = cache(async function getScrapMetaBySlug(
  slug: string
): Promise<ScrapMeta | null> {
  const parsed = await _loadAndParseScrapMeta(slug);
  return parsed?.meta ?? null;
});

/**
 * 単スクラップ取得（詳細ページ用）- サーバー側のみ
 */
export async function getScrap(slug: string): Promise<Scrap | null> {
  const parsed = await _loadAndParseScrapMeta(slug);
  if (!parsed) return null;

  // 本番ビルド時は draft: true のスクラップへのアクセスを拒否する
  const isDev = process.env.NODE_ENV !== 'production';
  if (!isDev && parsed.meta.draft) return null;

  const { html: htmlContent } = await renderPostMarkdown(parsed.content);

  return {
    ...parsed.meta,
    content: htmlContent,
  };
}
