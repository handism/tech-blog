import fs from 'fs/promises';
import path from 'path';
import { AwsPatternMeta, AwsPatternMetaSchema } from '../types/aws-gallery';
import { z } from 'zod';
import { fileExists } from './server-utils';

const awsDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'aws-patterns');
const metaPath = path.join(/*turbopackIgnore: true*/ awsDir, 'gallery-meta.json');
const iacDir = path.join(/*turbopackIgnore: true*/ awsDir, 'iac');
const imgDir = path.join(/*turbopackIgnore: true*/ awsDir, 'img');

const publicDestDir = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'aws-patterns');

/**
 * ファイルが必要な場合のみコピーを行う（更新日時比較）。
 */
async function ensureAssetCopied(srcFile: string, destName: string): Promise<void> {
  if (!(await fileExists(srcFile))) {
    return;
  }
  await fs.mkdir(publicDestDir, { recursive: true });
  const destFile = path.join(/*turbopackIgnore: true*/ publicDestDir, destName);

  let shouldCopy = true;
  if (await fileExists(destFile)) {
    try {
      const srcStat = await fs.stat(srcFile);
      const destStat = await fs.stat(destFile);
      if (srcStat.mtimeMs <= destStat.mtimeMs) {
        shouldCopy = false;
      }
    } catch {
      // stat取得でエラーがあった場合は念のためコピーする
      shouldCopy = true;
    }
  }

  if (shouldCopy) {
    await fs.copyFile(srcFile, destFile);
  }
}

/**
 * 全アーキテクチャパターンのメタデータを取得し、
 * 同時に必要なアセット（YAML、画像）を public 領域へ自動コピーします。
 */
export async function readAllPatternMetas(): Promise<AwsPatternMeta[]> {
  if (!(await fileExists(metaPath))) {
    return [];
  }

  const raw = await fs.readFile(metaPath, 'utf-8');
  const parsed = JSON.parse(raw);

  const ArraySchema = z.array(AwsPatternMetaSchema);
  const metas = ArraySchema.parse(parsed);

  // ビルド/開発時に必要なアセットを自動コピー
  await Promise.all(
    metas.flatMap((meta) => {
      const tasks: Promise<void>[] = [];
      // YAMLファイルのコピー
      const yamlSrc = path.join(/*turbopackIgnore: true*/ iacDir, meta.templateFile);
      tasks.push(ensureAssetCopied(yamlSrc, meta.templateFile));

      // 画像（SVG）ファイルのコピー
      if (meta.diagramFile) {
        const imgSrc = path.join(/*turbopackIgnore: true*/ imgDir, meta.diagramFile);
        tasks.push(ensureAssetCopied(imgSrc, meta.diagramFile));
      }
      return tasks;
    })
  );

  return metas;
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
