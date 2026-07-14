// src/lib/post-parser.ts
import { siteConfig } from '@/src/config/site';
import type { PostMeta } from '@/src/types/post';
import { estimateReadingMinutes, parseFrontmatter, zodDateSchema } from '@/src/lib/utils';
import { markdownToPlaintext } from '@/src/lib/markdown-utils';
import { tokenizeForSearch } from '@/src/lib/text-tokenizer';
import { z } from 'zod';

/**
 * frontmatter のバリデーションスキーマ。
 * 不正な値はデフォルト値にフォールバックする。
 */
const FrontmatterSchema = z.object({
  title: z.string().min(1).default(siteConfig.posts.defaultTitle),
  date: zodDateSchema,
  tags: z.array(z.string()).default([]).catch([]),
  category: z.string().min(1).default(siteConfig.posts.defaultCategory),
  image: z.string().optional(),
  draft: z.boolean().optional(),
});

type ValidatedFrontmatter = z.infer<typeof FrontmatterSchema>;

/**
 * 検索キーワード（keywords）の最大文字数。
 * keywords は検索インデックス（search.json）へ全記事分が埋め込まれるため、
 * 記事の長さに比例した肥大化を防ぐ目的で上限を設ける。
 */
const MAX_KEYWORDS_LENGTH = 5000;

type ParsedPostSource = {
  data: ValidatedFrontmatter;
  content: string;
};

/**
 * Markdown文字列をfrontmatterと本文に分解する。
 * frontmatterは Zod でバリデーションし、不正な値はデフォルト値にフォールバックする。
 */
export function parsePostSource(raw: string): ParsedPostSource {
  return parseFrontmatter(raw, FrontmatterSchema);
}

/**
 * frontmatterと本文から一覧向けメタ情報を生成する。
 */
export async function createPostMeta(
  slug: string,
  data: ValidatedFrontmatter,
  content: string
): Promise<PostMeta> {
  const plaintext = markdownToPlaintext(content);
  // 検索キーワードをトークナイズして生成する
  const keywords = tokenizeForSearch(plaintext);
  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    category: data.category,
    keywords: keywords.slice(0, MAX_KEYWORDS_LENGTH),
    plaintext: plaintext.slice(0, 5000), // 検索用に長めに保持
    description: plaintext.slice(0, 200), // 一覧表示用
    readingMinutes: estimateReadingMinutes(plaintext),
    image: data.image,
    draft: data.draft,
  };
}
