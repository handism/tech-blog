// src/lib/post-parser.ts
import { siteConfig } from '@/src/config/site';
import type { PostMeta } from '@/src/types/post';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * frontmatter のバリデーションスキーマ。
 * 不正な値はデフォルト値にフォールバックする。
 */
const FrontmatterSchema = z.object({
  title: z.string().min(1).default(siteConfig.posts.defaultTitle),
  date: z
    .union([z.string(), z.date()])
    .transform((v) => new Date(v))
    .pipe(z.date())
    .optional(),
  tags: z
    .array(z.string())
    .default([])
    .catch([]),
  category: z.string().min(1).default(siteConfig.posts.defaultCategory),
  image: z.string().optional(),
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
  const { data, content } = matter(raw);
  const result = FrontmatterSchema.safeParse(data);
  return {
    data: result.success ? result.data : FrontmatterSchema.parse({}),
    content,
  };
}

/**
 * マークダウン本文をプレーンテキストに変換する。
 * コードブロック・画像・テーブル・HTML タグなどを除去し、本文のみ残す。
 */
function markdownToPlaintext(markdown: string): string {
  return (
    markdown
      // フェンスコードブロック（``` または ~~~）
      .replace(/`{3}[\s\S]*?`{3}/g, '')
      .replace(/~{3}[\s\S]*?~{3}/g, '')
      // 見出し記号
      .replace(/^#{1,6}\s+/gm, '')
      // 画像（alt テキストも除去）
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // リンク（テキストは残す）
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      // インラインコード
      .replace(/`[^`\n]+`/g, '')
      // 太字・斜体（テキストは残す）
      .replace(/\*\*([^*\n]+)\*\*/g, '$1')
      .replace(/__([^_\n]+)__/g, '$1')
      .replace(/\*([^*\n]+)\*/g, '$1')
      .replace(/_([^_\n]+)_/g, '$1')
      // 取り消し線（テキストは残す）
      .replace(/~~([^~\n]+)~~/g, '$1')
      // 引用マーカー
      .replace(/^>\s*/gm, '')
      // 水平線
      .replace(/^[-*_]{3,}\s*$/gm, '')
      // テーブル区切り行（|---|---|）
      .replace(/^[\s|:-]+\|[\s|:-]+$/gm, '')
      // テーブルのパイプをスペースに
      .replace(/\|/g, ' ')
      // HTML タグ
      .replace(/<[^>]+>/g, '')
      // 余白整理
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * frontmatterと本文から一覧向けメタ情報を生成する。
 */
export function createPostMeta(slug: string, data: ValidatedFrontmatter, content: string): PostMeta {
  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags,
    category: data.category,
    plaintext: markdownToPlaintext(content),
    image: data.image,
  };
}
