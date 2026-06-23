// src/lib/learning-parser.ts
import { siteConfig } from '@/src/config/site';
import { markdownToPlaintext } from '@/src/lib/post-parser';
import { zodDateSchema } from '@/src/lib/utils';
import type { LearningPostMeta } from '@/src/types/learning';
import matter from 'gray-matter';
import { z } from 'zod';

const LearningQuizSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctIndex: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

/**
 * 学習記事 frontmatter のバリデーションスキーマ。
 */
const LearningFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1)
    .default(() => siteConfig.learning.defaultTitle),
  date: zodDateSchema.optional(),
  order: z.number().int().default(1),
  draft: z.boolean().optional(),
  quiz: LearningQuizSchema.optional(),
});

type ValidatedLearningFrontmatter = z.infer<typeof LearningFrontmatterSchema>;

type ParsedLearningSource = {
  data: ValidatedLearningFrontmatter;
  content: string;
};

/**
 * 学習記事のMarkdown文字列をfrontmatterと本文に分解する。
 */
export function parseLearningSource(raw: string): ParsedLearningSource {
  const { data, content } = matter(raw);
  const result = LearningFrontmatterSchema.safeParse(data);
  return {
    data: result.success ? result.data : LearningFrontmatterSchema.parse({}),
    content,
  };
}

/**
 * frontmatterと本文から学習記事のメタ情報を生成する。
 */
export function createLearningMeta(
  course: string,
  slug: string,
  data: ValidatedLearningFrontmatter,
  content: string
): LearningPostMeta {
  const plaintext = markdownToPlaintext(content);
  return {
    course,
    slug,
    title: data.title,
    date: data.date,
    order: data.order,
    draft: data.draft,
    plaintext: plaintext,
    quiz: data.quiz,
  };
}
