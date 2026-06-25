// src/types/aws-gallery.ts
import { z } from 'zod';

/**
 * AWSアーキテクチャパターンのメタデータに対するZodバリデーションスキーマ。
 */
export const AwsPatternMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  templateFile: z.string(),
  diagramFile: z.string().nullable(),
  awsServices: z.array(z.string()),
});

/**
 * メタデータのTypeScript型。
 */
export type AwsPatternMeta = z.infer<typeof AwsPatternMetaSchema>;

/**
 * HTMLプレビューおよび生コードを含んだAWSアーキテクチャパターンの完全なデータ型。
 */
export type AwsPattern = AwsPatternMeta & {
  yamlCode: string;
  htmlCode: string; // ShikiでシンタックスハイライトされたHTML
};
