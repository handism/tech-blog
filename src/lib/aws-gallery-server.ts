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
 * CloudFormationのYAMLからType: AWS::...のリソースタイプを抽出し、カウントしてソートして返します。
 */
export function extractAwsResources(yamlCode: string): { type: string; count: number }[] {
  const resourceMap: Record<string, number> = {};
  const lines = yamlCode.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*Type:\s*['"]?(AWS::[a-zA-Z0-9]+::[a-zA-Z0-9]+)['"]?/);
    if (match) {
      const resourceType = match[1];
      resourceMap[resourceType] = (resourceMap[resourceType] || 0) + 1;
    }
  }
  return Object.entries(resourceMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

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

  // Markdownのコードブロック形式にし、既存 of renderPostMarkdownを呼び出すことで、
  // 他のブログ記事等と同じShikiテーマおよびファイル名ラベル表示を適用します。
  const mdContent = `\`\`\`yaml:${meta.templateFile}\n${yamlCode}\n\`\`\``;
  const { html } = await renderPostMarkdown(mdContent);

  const resources = extractAwsResources(yamlCode);

  return {
    ...meta,
    yamlCode,
    htmlCode: html,
    resources,
  };
});
