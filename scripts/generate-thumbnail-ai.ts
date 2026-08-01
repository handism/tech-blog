import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

const OUTPUT_WIDTH = 1024;
const OUTPUT_HEIGHT = 576;

interface ArticleMeta {
  title: string;
  tags: string[];
  category: string;
  contentExcerpt: string;
}

interface CliOptions {
  slug: string;
  debug: boolean;
  titleOverride?: string;
  labelOverride?: string;
}

function loadEnvLocal(): void {
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

function parseArticle(rawMarkdown: string): ArticleMeta {
  let title = '';
  let tags: string[] = [];
  let category = '';
  let contentExcerpt = '';

  const fmMatch = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fmText = fmMatch[1];
    for (const line of fmText.split(/\r?\n/)) {
      const titleMatch = line.match(/^title:\s*(.+)$/);
      if (titleMatch) title = titleMatch[1].replace(/^["']|["']$/g, '');

      const tagsMatch = line.match(/^tags:\s*\[(.*)\]$/);
      if (tagsMatch) {
        tags = tagsMatch[1]
          .split(',')
          .map((value) => value.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }

      const categoryMatch = line.match(/^category:\s*(.+)$/);
      if (categoryMatch) {
        category = categoryMatch[1].replace(/^["']|["']$/g, '');
      }
    }

    contentExcerpt = rawMarkdown.slice(fmMatch[0].length).trim().slice(0, 3000);
  } else {
    contentExcerpt = rawMarkdown.slice(0, 3000);
  }

  return {
    title: title || 'Tech Blog Article',
    tags,
    category: category || 'Tech',
    contentExcerpt,
  };
}

function updateArticleFrontmatter(filePath: string, imageFilename: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
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

  fs.writeFileSync(filePath, nextContent, 'utf-8');
  console.log(`       記事フロントマターを更新しました: image: ${imageFilename}`);
}

function parseCliArgs(args: string[]): CliOptions {
  const slugArg = args.find((arg) => !arg.startsWith('--'));
  if (!slugArg) throw new Error('記事 slug を指定してください。');

  const readOption = (name: string): string | undefined => {
    const prefix = `--${name}=`;
    return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  };

  return {
    slug: slugArg.endsWith('.md') ? slugArg.slice(0, -3) : slugArg,
    debug: args.includes('--debug'),
    titleOverride: readOption('title'),
    labelOverride: readOption('label'),
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

function buildPrompt(article: ArticleMeta, options: CliOptions): string {
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
・概要: ${article.contentExcerpt.slice(0, 400)}${customTitle}${customLabel}

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
  const mdPath = path.resolve(process.cwd(), 'md', `${options.slug}.md`);

  if (!fs.existsSync(mdPath)) {
    throw new Error(`記事ファイルが見つかりません: ${mdPath}`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('.env.local に GEMINI_API_KEY=<APIキー> を設定してください。');
  }

  const imageModel = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3-pro-image';
  const requestedImageSize = process.env.GEMINI_IMAGE_SIZE ?? '1K';
  const imageSize = ['1K', '2K', '4K'].includes(requestedImageSize)
    ? (requestedImageSize as '1K' | '2K' | '4K')
    : '1K';

  const rawMarkdown = fs.readFileSync(mdPath, 'utf-8');
  const article = parseArticle(rawMarkdown);
  console.log(`[1/4] 記事を読み込みました: "${article.title}"`);

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(article, options);

  console.log(`[2/4] ${imageModel} でYouTube風サムネイル画像を生成中... (文言・イラスト共にAIにお任せ)`);
  const interaction = await ai.interactions.create({
    model: imageModel,
    input: prompt,
    response_format: {
      type: 'image',
      mime_type: 'image/jpeg',
      aspect_ratio: '16:9',
      image_size: imageSize,
    },
  });

  const generatedImage = interaction.output_image;
  if (!generatedImage?.data) {
    throw new Error('画像生成APIから画像データが返されませんでした。');
  }

  const imageBuffer = Buffer.from(generatedImage.data, 'base64');
  const outputDir = path.resolve(process.cwd(), 'public', 'images');
  fs.mkdirSync(outputDir, { recursive: true });

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
  updateArticleFrontmatter(mdPath, outputFilename);
  console.log('🎉 サムネイル生成が完了しました。');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(`\nエラーが発生しました:\n${message}`);
  process.exit(1);
});
