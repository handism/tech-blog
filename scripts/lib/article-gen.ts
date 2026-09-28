/**
 * AI 画像生成スクリプト（gen-thumb / gen-thumb-ai / gen-info）の共通ヘルパー。
 *
 * 注意: gen-thumb は fontconfig の環境変数を設定してから sharp を動的 import する必要があるため、
 * このモジュールでは sharp を import しないこと。
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { GoogleGenAI } from '@google/genai';

export type ImageSize = '1K' | '2K' | '4K';

export interface Article {
  title: string;
  tags: string[];
  category: string;
  /** フロントマターを除いた本文（前後の空白は除去済み） */
  content: string;
}

const DEFAULT_TITLE = 'Tech Blog Article';
const DEFAULT_CATEGORY = 'Tech';
const IMAGE_SIZES: readonly ImageSize[] = ['1K', '2K', '4K'];

export const DEFAULT_PLAN_MODEL = 'gemini-3.5-flash-lite';
export const DEFAULT_IMAGE_MODEL = 'gemini-3-pro-image';

/**
 * .env.local から環境変数を手動ロードする。
 * 実行環境によっては Bun が .env.local を自動読み込みしないケースのフォールバック。
 * 既に設定済みの環境変数は上書きしない。
 */
export function loadEnvLocal(): void {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) process.env[key] = value;
  }
}

/**
 * GEMINI_API_KEY を取得する。未設定ならエラーを投げる。
 */
export function requireGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('.env.local に GEMINI_API_KEY=<APIキー> を設定してください。');
  }
  return apiKey;
}

/**
 * 画像生成モデルと出力サイズを環境変数から解決する。
 */
export function resolveImageConfig(): { imageModel: string; imageSize: ImageSize } {
  const requested = process.env.GEMINI_IMAGE_SIZE ?? '1K';
  return {
    imageModel: process.env.GEMINI_IMAGE_MODEL ?? DEFAULT_IMAGE_MODEL,
    imageSize: IMAGE_SIZES.includes(requested as ImageSize) ? (requested as ImageSize) : '1K',
  };
}

/**
 * CLI 引数の slug（`foo` / `foo.md`）を正規化する。
 */
export function normalizeSlug(slugArg: string): string {
  return slugArg.endsWith('.md') ? slugArg.slice(0, -3) : slugArg;
}

/**
 * `--name=value` 形式の CLI オプションを読む。
 */
export function readCliOption(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

/**
 * slug から記事ファイル（md/<slug>.md）のパスを解決する。存在しなければエラーを投げる。
 */
export function resolveArticlePath(slug: string): string {
  const mdPath = path.resolve(process.cwd(), 'md', `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    throw new Error(`記事ファイルが見つかりません: ${mdPath}`);
  }
  return mdPath;
}

/**
 * 記事ファイルを読み込み、フロントマターの主要項目と本文を返す。
 * gray-matter で解析するため、複数行形式の tags などにも対応する。
 */
export function readArticle(mdPath: string): Article {
  const { data, content } = matter(fs.readFileSync(mdPath, 'utf-8'));
  const asNonEmptyString = (value: unknown): string | undefined =>
    typeof value === 'string' && value.trim() ? value.trim() : undefined;

  return {
    title: asNonEmptyString(data.title) ?? DEFAULT_TITLE,
    tags: Array.isArray(data.tags) ? data.tags.map(String).filter(Boolean) : [],
    category: asNonEmptyString(data.category) ?? DEFAULT_CATEGORY,
    content: content.trim(),
  };
}

/**
 * 記事フロントマターの image を追記または上書きする。
 * 既存フロントマターの書式（キー順・クォート等）を崩さないよう、gray-matter で再シリアライズせず
 * 該当行のみを置換する。
 */
export function updateArticleImage(mdPath: string, imageFilename: string): void {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);

  if (!fmMatch) {
    console.warn(
      '警告: フロントマターが見つからなかったため、image フィールドの更新をスキップします。'
    );
    return;
  }

  const fmBody = fmMatch[2];
  const nextFmBody = /^image:\s*.+$/m.test(fmBody)
    ? fmBody.replace(/^image:\s*.+$/m, `image: ${imageFilename}`)
    : `${fmBody}\nimage: ${imageFilename}`;

  const nextContent = content.replace(fmMatch[0], `${fmMatch[1]}${nextFmBody}${fmMatch[3]}`);

  fs.writeFileSync(mdPath, nextContent, 'utf-8');
  console.log(`       記事フロントマターを更新しました: image: ${imageFilename}`);
}

/**
 * AI の応答テキストから JSON オブジェクト部分を抽出する（コードフェンスや前後の説明文を除去）。
 */
export function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  throw new Error(`JSON を抽出できませんでした。応答: ${text}`);
}

/**
 * 16:9 の画像を生成し、バイナリを返す。
 */
export async function generateImage(
  ai: GoogleGenAI,
  params: { model: string; prompt: string; imageSize: ImageSize }
): Promise<Buffer> {
  const interaction = await ai.interactions.create({
    model: params.model,
    input: params.prompt,
    response_format: {
      type: 'image',
      mime_type: 'image/jpeg',
      aspect_ratio: '16:9',
      image_size: params.imageSize,
    },
  });

  const generatedImage = interaction.output_image;
  if (!generatedImage?.data) {
    throw new Error('画像生成APIから画像データが返されませんでした。');
  }
  return Buffer.from(generatedImage.data, 'base64');
}

/**
 * 出力先ディレクトリ（public/images）を用意してパスを返す。
 */
export function ensureImagesDir(): string {
  const outputDir = path.resolve(process.cwd(), 'public', 'images');
  fs.mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

/**
 * main() を実行し、例外はスタック付きで表示して終了コード 1 で終える。
 */
export function runMain(main: () => Promise<void>): void {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    console.error(`\nエラーが発生しました:\n${message}`);
    process.exit(1);
  });
}
