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

ブログ記事 (md/<slug>.md) の内容から Nano Banana Pro (gemini-3-pro-image) を使用して
強く目を引く高品質なブログ記事サムネイル画像を自動生成し、16:9 (1024x576, WebP形式) で保存した上で
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
You are an expert art director and professional thumbnail designer for technical blog posts.
Analyze the following Japanese blog article metadata and excerpt:
- Title: "${article.title}"
- Tags: ${JSON.stringify(article.tags)}
- Category: "${article.category}"
- Content excerpt: "${article.contentExcerpt.replace(/\r?\n/g, ' ')}"

Your task is to generate ONE detailed English image generation prompt for Google GenAI Nano Banana Pro (gemini-3-pro-image) that creates a highly eye-catching, professional blog post thumbnail.
While the prompt instructions must be written in English, the required catchphrase text MUST be written in Japanese and enclosed in quotes so the model renders it accurately.

### MANDATORY COMPOSITION & DESIGN RULES
You must incorporate all of the following design principles into the generated prompt:

1. **Instant Theme Recognition & Strong Visual Hierarchy**: The thumbnail must communicate the article's core topic instantly at a glance with a bold, simple composition and a strong visual hierarchy.
2. **Bold Asymmetrical Layout**:
   - Choose either the RIGHT or LEFT side of the screen to prominently feature a large main subject (a person, character, product, or symbolic motif representing the article theme).
   - On the opposite side, ensure a clean, spacious, uncluttered margin area dedicated to displaying a large Japanese catchphrase.
3. **Japanese Catchphrase & Typography**:
   - Create an impactful, concise Japanese catchphrase (around 2 to 12 Japanese characters, short and memorable) based on the article's theme.
   - Specify that this Japanese catchphrase text (e.g., "キャッチコピー文言") is rendered in extremely large, bold, highly legible Japanese typography.
   - Include typography styling: thick outlines (bold borders), subtle 3D depth/bevel, and strong drop shadows so it can be instantly read even on small smartphone screens.
4. **High-Saturation Color Palette**:
   - Use a highly saturated, eye-catching color scheme dominated by **Yellow, Black, and Red** to maximize contrast between the background, text, and main subject.
5. **Subtle Guidance Effects**:
   - Use subtle lighting, speed lines (focus lines), arrows, or highlights sparingly to guide the viewer's eye toward the main subject and the catchphrase text.
6. **Atmospheric & Defocused Background**:
   - The background should be an impressive, evocative environment that fits the article theme, but keep visual clutter and information density low, and make it **slightly blurred (defocused)** to accentuate the foreground subject and typography.
7. **Prohibitions**:
   - Do NOT include any extra or small unreadable text, random words, logos, watermarks, or overly complex/cluttered backgrounds.

### HOW TO CONSTRUCT THE PROMPT
Construct a single, cohesive English image generation prompt that specifies:
- The bold, professional tech blog thumbnail aesthetic with strong visual hierarchy and simple composition.
- The layout choice: e.g., "On the right side, prominently feature a large [detailed description of person/character/product/motif]..." and "On the clean, spacious left side, display the Japanese catchphrase..." (or left/right reversed).
- The exact Japanese catchphrase string enclosed in quotes, along with the required large bold lettering, thick outline, subtle 3D depth, and drop shadow.
- The high-saturation Yellow, Black, and Red color scheme maximizing contrast.
- The subtle lighting, focus lines, arrows, or highlights guiding attention to the main subject and text.
- The theme-appropriate, low-information, slightly blurred background.
- Negative constraints appended at the end.

### FEW-SHOT EXAMPLE FOR REFERENCE
"A professional, eye-catching tech blog thumbnail with a bold asymmetrical layout and strong visual hierarchy. On the right side, prominently feature a large, expressive software engineer mascot character working on a sleek holographic code interface. On the clean, spacious left side, display the Japanese catchphrase '爆速開発の手法' in extremely large, thick, highly legible Japanese lettering with bold black outlines, subtle 3D depth, and drop shadows for instant smartphone readability. Highly saturated color palette dominated by yellow, black, and red to maximize contrast between the background and text. Subtle lighting effects and subtle focus lines guide the eye toward the character and catchphrase. The background is an atmospheric modern server room, kept low-information and slightly blurred to emphasize the foreground. Masterpiece --no extra text, small unreadable characters, random English words, logos, watermarks, cluttered background, messy typography"

### NEGATIVE CONSTRAINTS REQUIREMENT
STRICTLY append the following exclusion keywords at the very end of your prompt string:
"masterpiece --no extra text, small unreadable characters, random English words, logos, watermarks, cluttered background, messy typography, blurry foreground"

OUTPUT RULES:
- Output ONLY the single prompt string to be fed directly into the image generation model.
- Do NOT include markdown code blocks, quotes around the entire output, or explanations.
`;

  console.log('[2/4] Gemini で最適なサムネイル画像生成プロンプトを構築中...');
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: promptBuilderQuery,
  });

  const englishPrompt = (textResponse.text || '').trim();
  console.log(`       生成されたプロンプト:\n       "${englishPrompt}"`);

  console.log('[3/4] Nano Banana Pro (gemini-3-pro-image) で画像生成中...');
  const interaction = await ai.interactions.create({
    model: 'gemini-3-pro-image',
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
