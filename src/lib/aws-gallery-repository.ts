import fs from 'fs/promises';
import path from 'path';
import { AwsPatternMeta, AwsPatternMetaSchema } from '../types/aws-gallery';
import { z } from 'zod';
import { fileExists } from './server-utils';

const awsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'patterns');
const metaPath = path.join(/*turbopackIgnore: true*/ awsDir, 'gallery-meta.json');
const iacDir = path.join(/*turbopackIgnore: true*/ awsDir, 'iac');

/**
 * 全アーキテクチャパターンのメタデータを取得します。
 *
 * アセット（YAML・画像）の public 領域へのコピーは prebuild スクリプト
 * （scripts/copy-pattern-assets.js）が担うため、この関数は純粋な読み取りのみを行います。
 */
export async function readAllPatternMetas(): Promise<AwsPatternMeta[]> {
  if (!(await fileExists(metaPath))) {
    return [];
  }

  const raw = await fs.readFile(metaPath, 'utf-8');
  const parsed = JSON.parse(raw);

  const ArraySchema = z.array(AwsPatternMetaSchema);
  return ArraySchema.parse(parsed);
}

/**
 * 指定されたスラグに対応するメタデータを取得します。
 */
export async function readPatternMetaBySlug(slug: string): Promise<AwsPatternMeta | null> {
  const metas = await readAllPatternMetas();
  return metas.find((m) => m.slug === slug) || null;
}

/**
 * 指定されたテンプレートファイルの内容（YAMLコード）をテキストとして読み込みます。
 */
export async function readYamlCode(templateFile: string): Promise<string> {
  const yamlPath = path.join(/*turbopackIgnore: true*/ iacDir, templateFile);
  if (!(await fileExists(yamlPath))) {
    throw new Error(`CloudFormation template file not found: ${yamlPath}`);
  }
  return fs.readFile(yamlPath, 'utf-8');
}
