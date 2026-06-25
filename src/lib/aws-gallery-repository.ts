// src/lib/aws-gallery-repository.ts
import fs from 'fs';
import path from 'path';
import { AwsPatternMeta, AwsPatternMetaSchema } from '../types/aws-gallery';
import { z } from 'zod';

const awsDir = path.join(process.cwd(), 'aws-patterns');
const metaPath = path.join(awsDir, 'gallery-meta.json');
const iacDir = path.join(awsDir, 'iac');
const imgDir = path.join(awsDir, 'img');

const publicDestDir = path.join(process.cwd(), 'public', 'aws-patterns');

/**
 * ファイルが必要な場合のみコピーを行う（更新日時比較）。
 */
function ensureAssetCopied(srcFile: string, destName: string) {
  if (!fs.existsSync(srcFile)) {
    return;
  }
  if (!fs.existsSync(publicDestDir)) {
    fs.mkdirSync(publicDestDir, { recursive: true });
  }
  const destFile = path.join(publicDestDir, destName);

  let shouldCopy = true;
  if (fs.existsSync(destFile)) {
    const srcStat = fs.statSync(srcFile);
    const destStat = fs.statSync(destFile);
    if (srcStat.mtimeMs <= destStat.mtimeMs) {
      shouldCopy = false;
    }
  }

  if (shouldCopy) {
    fs.copyFileSync(srcFile, destFile);
  }
}

/**
 * 全アーキテクチャパターンのメタデータを取得し、
 * 同時に必要なアセット（YAML、画像）を public 領域へ自動コピーします。
 */
export async function readAllPatternMetas(): Promise<AwsPatternMeta[]> {
  if (!fs.existsSync(metaPath)) {
    return [];
  }

  const raw = fs.readFileSync(metaPath, 'utf-8');
  const parsed = JSON.parse(raw);

  const ArraySchema = z.array(AwsPatternMetaSchema);
  const metas = ArraySchema.parse(parsed);

  // ビルド/開発時に必要なアセットを自動コピー
  for (const meta of metas) {
    // YAMLファイルのコピー
    const yamlSrc = path.join(iacDir, meta.templateFile);
    ensureAssetCopied(yamlSrc, meta.templateFile);

    // 画像（SVG）ファイルのコピー
    if (meta.diagramFile) {
      const imgSrc = path.join(imgDir, meta.diagramFile);
      ensureAssetCopied(imgSrc, meta.diagramFile);
    }
  }

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
  const yamlPath = path.join(iacDir, templateFile);
  if (!fs.existsSync(yamlPath)) {
    throw new Error(`CloudFormation template file not found: ${yamlPath}`);
  }
  return fs.readFileSync(yamlPath, 'utf-8');
}
