import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import {
  type Article,
  ensureImagesDir,
  generateImage,
  loadEnvLocal,
  normalizeSlug,
  readArticle,
  readCliOption,
  requireGeminiApiKey,
  resolveArticlePath,
  resolveImageConfig,
  runMain,
  updateArticleImage,
} from './lib/article-gen';

const OUTPUT_WIDTH = 1024;
const OUTPUT_HEIGHT = 576;

interface CliOptions {
  slug: string;
  debug: boolean;
  titleOverride?: string;
  labelOverride?: string;
}

function parseCliArgs(args: string[]): CliOptions {
  const slugArg = args.find((arg) => !arg.startsWith('--'));
  if (!slugArg) throw new Error('記事 slug を指定してください。');

  return {
    slug: normalizeSlug(slugArg),
    debug: args.includes('--debug'),
    titleOverride: readCliOption(args, 'title'),
    labelOverride: readCliOption(args, 'label'),
  };
}

function printHelp(): void {
  console.log(`使用方法:
  bun run gen-thumb-ai <slug> [options]
  (または: bun run scripts/generate-thumbnail-ai.ts <slug> [options])

Options:
  --debug                 生成に使用したプロンプトや画像を _thumb-debug に保存
  --title=<日本語見出し>  メインタイトル文言をAIに指定
  --label=<補助ラベル>    補助ラベル文言をAIに指定

Environment:
  GEMINI_IMAGE_MODEL=gemini-3-pro-image (デフォルト)
  GEMINI_IMAGE_SIZE=1K|2K|4K (デフォルト: 1K)
`);
}

function buildPrompt(article: Article, options: CliOptions): string {
  const customTitle = options.titleOverride
    ? `\n画像内に大きく表示してほしいメインタイトル文言: "${options.titleOverride}"`
    : '';
  const customLabel = options.labelOverride
    ? `\n補助テキスト・ラベル文言: "${options.labelOverride}"`
    : '';

  return `
以下の技術ブログ記事のための、YouTubeのサムネイル画像を1枚生成してください。

【記事情報】
・タイトル: ${article.title}
・カテゴリ: ${article.category}
・タグ: ${article.tags.join(', ')}
・概要: ${article.content.slice(0, 400)}${customTitle}${customLabel}

【デザイン要件】
・YouTubeのサムネイルのような、目を引く魅力的な構図・デザインにしてください。
・写実的（フォトリアル）なデザインではなく、フラットなイラストのデザインを基本としてください。
・画像内に描画するタイトルや文字などの文言は、すべて自然な日本語としてください。
・細かい構図や配色、文字の配置、モチーフ、キャッチコピーなどの文言作成も含めて、AIの自由な創造的判断に任せます。
`.trim();
}

function saveDebugArtifacts(params: {
  outputDir: string;
  slug: string;
  prompt: string;
  imageBuffer: Buffer;
}): void {
  const debugDir = path.join(params.outputDir, '_thumb-debug', params.slug);
  fs.mkdirSync(debugDir, { recursive: true });

  fs.writeFileSync(path.join(debugDir, 'prompt-ai.txt'), `${params.prompt}\n`, 'utf-8');
  fs.writeFileSync(path.join(debugDir, 'thumbnail-ai.png'), params.imageBuffer);

  console.log(`       デバッグ素材: ${debugDir}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  loadEnvLocal();
  const options = parseCliArgs(args);
  const mdPath = resolveArticlePath(options.slug);
  const apiKey = requireGeminiApiKey();
  const { imageModel, imageSize } = resolveImageConfig();

  const article = readArticle(mdPath);
  console.log(`[1/4] 記事を読み込みました: "${article.title}"`);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(article, options);

  console.log(`[2/4] ${imageModel} でYouTube風サムネイル画像を生成中... (文言・イラスト共にAIにお任せ)`);
  const imageBuffer = await generateImage(ai, { model: imageModel, prompt, imageSize });
  const outputDir = ensureImagesDir();

  if (options.debug) {
    saveDebugArtifacts({
      outputDir,
      slug: options.slug,
      prompt,
      imageBuffer,
    });
  }

  console.log('[3/4] サムネイルサイズ (1024×576) へリサイズ・WebP変換して保存中...');
  const outputFilename = `${options.slug}-thumb.webp`;
  const outputPath = path.join(outputDir, outputFilename);

  await sharp(imageBuffer)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 91, effort: 5 })
    .toFile(outputPath);

  console.log(`[4/4] 保存しました: public/images/${outputFilename}`);
  updateArticleImage(mdPath, outputFilename);
  console.log('🎉 サムネイル生成が完了しました。');
}

runMain(main);
