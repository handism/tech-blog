import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

interface ArticleMeta {
  title: string;
  tags: string[];
  category: string;
  contentExcerpt: string;
}

/**
 * .env.local から環境変数を手動で安全にロードするヘルパー。
 * 実行環境によっては Bun が .env.local を自動読み込みしないケースのフォールバック。
 */
function loadEnvLocal(): void {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

/**
 * Markdown 文字列からフロントマターの主要項目および本文冒頭を抽出する。
 */
function parseArticle(rawMarkdown: string): ArticleMeta {
  let title = '';
  let tags: string[] = [];
  let category = '';
  let contentExcerpt = '';

  const fmMatch = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fmText = fmMatch[1];
    for (const line of fmText.split(/\r?\n/)) {
      const tMatch = line.match(/^title:\s*(.+)$/);
      if (tMatch) title = tMatch[1].replace(/^["']|["']$/g, '');
      const tagMatch = line.match(/^tags:\s*\[(.*)\]$/);
      if (tagMatch) {
        tags = tagMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
      const cMatch = line.match(/^category:\s*(.+)$/);
      if (cMatch) category = cMatch[1].replace(/^["']|["']$/g, '');
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

/**
 * 記事 Markdown のフロントマターにある image フィールドを自動追記または上書きする。
 */
function updateArticleFrontmatter(filePath: string, imageFilename: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/);
  if (!fmMatch) {
    console.warn(
      '警告: フロントマターが見つからなかったため、image フィールドの自動追記をスキップします。'
    );
    return;
  }

  const fmBody = fmMatch[2];
  let newFmBody: string;
  if (/^image:\s*.+$/m.test(fmBody)) {
    newFmBody = fmBody.replace(/^image:\s*.+$/m, `image: ${imageFilename}`);
  } else {
    newFmBody = `${fmBody}\nimage: ${imageFilename}`;
  }

  const newContent = content.replace(fmMatch[0], `${fmMatch[1]}${newFmBody}${fmMatch[3]}`);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`       記事フロントマターを更新しました: image: ${imageFilename}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`使用方法: bun run gen-thumb <slug>

ブログ記事 (md/<slug>.md) の内容から Nano Banana 2 Lite (gemini-3.1-flash-lite-image) を使用して
フラットポップ調のサムネイル画像を自動生成し、16:9 (1024x576, WebP形式) で保存した上で
記事フロントマターの image フィールドを更新します。
`);
    process.exit(args.length === 0 ? 1 : 0);
  }

  let slug = args[0];
  if (slug.endsWith('.md')) {
    slug = slug.slice(0, -3);
  }

  const mdPath = path.resolve(process.cwd(), 'md', `${slug}.md`);
  if (!fs.existsSync(mdPath)) {
    console.error(`エラー: 記事ファイル "${mdPath}" が見つかりません。`);
    process.exit(1);
  }

  loadEnvLocal();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      'エラー: GEMINI_API_KEY が設定されていません。.env.local に GEMINI_API_KEY=<あなたのAPIキー> を設定してください。'
    );
    process.exit(1);
  }

  const rawMarkdown = fs.readFileSync(mdPath, 'utf-8');
  const article = parseArticle(rawMarkdown);
  console.log(`[1/4] 記事 "md/${slug}.md" を読み込みました (タイトル: "${article.title}")`);

  const ai = new GoogleGenAI({ apiKey });

  const promptBuilderQuery = `
You are an expert pop-art thumbnail prompt creator for technical blog posts.
Analyze the following Japanese blog article metadata and excerpt:
- Title: "${article.title}"
- Tags: ${JSON.stringify(article.tags)}
- Category: "${article.category}"
- Content excerpt: "${article.contentExcerpt.replace(/\r?\n/g, ' ')}"

Your task is to generate ONE detailed English image generation prompt for Google GenAI Nano Banana 2 Lite (gemini-3.1-flash-lite-image) that creates an eye-catching "flat-pop" or "pop-art" style thumbnail.

CHOOSE ONE OF THREE SUBJECT PATTERNS based on the topic:
1. Object / Technology focus (for specific tech stacks, tools, devices, logos, servers)
2. Infographic / Conceptual diagram (for architecture, systems, network flow, algorithms)
3. Mascot / Anime Character focus (for beginner guides, soft topics, or character-themed articles)

MANDATORY STYLE RULES (must be reflected in the prompt):
- superflat pop-art style, vibrant high-saturation palette, bold graphic shapes, flat color blocking, flat shading only, hard color boundaries, bold vector-like graphics, clean crisp edges, clean line-art, poster-style pop-art motifs
- Center the main subject with generous margins around it (so it can be cropped to 16:9 widescreen later without losing key parts)
- Colorful pop-art background with simple geometric shapes, stars, or dots
- NEVER include text, letters, characters, typography, or words in the image
- STRICTLY append the following negative prompt keywords at the end of your prompt string:
  "masterpiece --no gradients, shadows, depth cues, realistic texture, 3d rendering, messy shading, blurry lines, text, watermark, letters, words, writing"
  (If Pattern 1, also append ", human, person")

OUTPUT RULES:
- Output ONLY the English prompt string.
- Do NOT include markdown code blocks, quotes, or explanations.
`;

  console.log('[2/4] Gemini で最適なフラットポップ調画像生成プロンプトを構築中...');
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: promptBuilderQuery,
  });

  const englishPrompt = (textResponse.text || '').trim();
  console.log(`       生成されたプロンプト:\n       "${englishPrompt}"`);

  console.log('[3/4] Nano Banana 2 Lite (gemini-3.1-flash-lite-image) で画像生成中...');
  const interaction = await ai.interactions.create({
    model: 'gemini-3.1-flash-lite-image',
    input: englishPrompt,
  });

  const generatedImage = interaction.output_image;
  if (!generatedImage || !generatedImage.data) {
    throw new Error('画像生成APIから有効な画像データが返されませんでした。');
  }

  const imageBuffer = Buffer.from(generatedImage.data, 'base64');

  console.log(
    '[4/4] 画像を 16:9 (1024x576) にクロップして WebP に変換・保存し、記事フロントマターを更新中...'
  );
  const outputDir = path.resolve(process.cwd(), 'public', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFilename = `${slug}-flatpop.webp`;
  const outputPath = path.resolve(outputDir, outputFilename);

  await sharp(imageBuffer)
    .resize(1024, 576, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`       画像ファイルを保存しました: "public/images/${outputFilename}"`);

  updateArticleFrontmatter(mdPath, outputFilename);
  console.log(`🎉 サムネイル生成が完了しました！`);
}

main().catch((err) => {
  console.error('エラーが発生しました:', err);
  process.exit(1);
});
