// src/lib/scrap-parser.ts
import { siteConfig } from '@/src/config/site';
import { markdownToPlaintext } from '@/src/lib/post-parser';
import type { ScrapMeta } from '@/src/types/scrap';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * スクラップ frontmatter のバリデーションスキーマ（最小構成）。
 */
const ScrapFrontmatterSchema = z.object({
  title: z.string().min(1).default(siteConfig.scraps.defaultTitle),
  date: z
    .union([z.string(), z.date()])
    .transform((v) => new Date(v))
    .pipe(z.date())
    .optional(),
  tags: z.array(z.string()).default([]).catch([]),
  draft: z.boolean().optional(),
});

type ValidatedScrapFrontmatter = z.infer<typeof ScrapFrontmatterSchema>;

type ParsedScrapSource = {
  data: ValidatedScrapFrontmatter;
  content: string;
};

/**
 * スクラップのMarkdown文字列をfrontmatterと本文に分解する。
 */
export function parseScrapSource(raw: string): ParsedScrapSource {
  const { data, content } = matter(raw);
  const result = ScrapFrontmatterSchema.safeParse(data);
  return {
    data: result.success ? result.data : ScrapFrontmatterSchema.parse({}),
    content,
  };
}

/**
 * frontmatterと本文からスクラップのメタ情報を生成する。
 */
export function createScrapMeta(
  slug: string,
  data: ValidatedScrapFrontmatter,
  content: string
): ScrapMeta {
  const plaintext = markdownToPlaintext(content);
  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    description: plaintext.slice(0, 100),
    draft: data.draft,
  };
}
