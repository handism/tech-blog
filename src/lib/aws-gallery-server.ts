// src/lib/aws-gallery-server.ts
import { cache } from 'react';
import { readAllPatternMetas, readPatternMetaBySlug, readYamlCode } from './aws-gallery-repository';
import { renderPostMarkdown } from './post-renderer';
import { AwsPattern, AwsPatternMeta } from '../types/aws-gallery';

/**
 * 全アーキテクチャパターンのメタデータをキャッシュ取得（一覧用）。
 */
export const getAllAwsPatternMetas = cache(async function getAllAwsPatternMetas(): Promise<
  AwsPatternMeta[]
> {
  return readAllPatternMetas();
});

/**
 * 指定されたスラグに対応するアーキテクチャパターンの詳細データをキャッシュ取得（詳細ページ用）。
 * テンプレートYAMLコードの読み込みと、ShikiによるハイライトHTMLの生成を行います。
 */
export const getAwsPatternBySlug = cache(async function getAwsPatternBySlug(
  slug: string
): Promise<AwsPattern | null> {
  const meta = await readPatternMetaBySlug(slug);
  if (!meta) {
    return null;
  }

  const yamlCode = await readYamlCode(meta.templateFile);

  // Markdownのコードブロック形式にし、既存のrenderPostMarkdownを呼び出すことで、
  // 他のブログ記事等と同じShikiテーマおよびファイル名ラベル表示を適用します。
  const mdContent = `\`\`\`yaml:${meta.templateFile}\n${yamlCode}\n\`\`\``;
  const { html } = await renderPostMarkdown(mdContent);

  return {
    ...meta,
    yamlCode,
    htmlCode: html,
  };
});
