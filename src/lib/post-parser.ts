// src/lib/post-parser.ts
import { siteConfig } from '@/src/config/site';
import type { PostMeta } from '@/src/types/post';
import { estimateReadingMinutes, parseFrontmatter, zodDateSchema } from '@/src/lib/utils';
import { markdownToPlaintext } from '@/src/lib/markdown-utils';
import { tokenizeForSearch } from '@/src/lib/kuromoji-tokenizer';
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
 * マークダウン本文をプレーンテキストに変換する。
 * コードブロック・画像・テーブル・HTML タグなどを除去し、本文のみ残す。
 */
/**
 * frontmatterと本文から一覧向けメタ情報を生成する。
 */
export async function createPostMeta(
  slug: string,
  data: ValidatedFrontmatter,
  content: string
): Promise<PostMeta> {
  const plaintext = markdownToPlaintext(content);
  // ビルド/サーバー時なので常に形態素解析を完了するのを待つ (waitLoad = true)
  const keywords = await tokenizeForSearch(plaintext, true);
  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    category: data.category,
    keywords,
    plaintext: plaintext.slice(0, 5000), // 検索用に長めに保持
    description: plaintext.slice(0, 200), // 一覧表示用
    readingMinutes: estimateReadingMinutes(plaintext),
    image: data.image,
    draft: data.draft,
  };
}
