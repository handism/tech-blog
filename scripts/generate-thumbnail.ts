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
今風のフラットで洗練されたエディトリアルイラスト調のブログ記事サムネイル画像を自動生成し、
16:9 (1024x576, WebP形式) で保存した上で記事フロントマターの image フィールドを更新します。
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
You are an expert art director and professional editorial illustrator for technical blog posts.
Analyze the following Japanese blog article metadata and excerpt:
- Title: "${article.title}"
- Tags: ${JSON.stringify(article.tags)}
- Category: "${article.category}"
- Content excerpt: "${article.contentExcerpt.replace(/\r?\n/g, ' ')}"

Your task is to generate ONE detailed English image generation prompt for Google GenAI Nano Banana Pro (gemini-3-pro-image) that creates a modern, flat, and sophisticated editorial illustration blog post thumbnail.
While the prompt instructions must be written in English, the required catchphrase text MUST be written in Japanese and enclosed in quotes so the model renders it accurately.

### MANDATORY COMPOSITION & DESIGN RULES
You must incorporate all of the following design principles into the generated prompt:

1. **Modern Flat Editorial Illustration Style**:
   - Do NOT use realistic, 3D rendered, or heavy metallic/glossy styles.
   - Use a contemporary, flat, and sophisticated editorial illustration style (like modern tech magazine artwork or clean design system illustration).
   - Express abstract concepts, systems, or subjects using **clear, well-designed editorial illustration elements** (such as people, metaphors, objects, or conceptual artwork) tailored to the article theme for immediate visual comprehension.
2. **Bright-Tone Color Palette (No Primary Color Blocking)**:
   - Avoid harsh, overly saturated primary color blocking (e.g., pure red, pure blue, bright neon yellow).
   - Use a curated, harmonious **bright-tone color palette**: feature colors such as **Sky Blue, Cyan, Mint, Coral, Pale/Soft Yellow, Off-White, and Navy**.
3. **Japanese Typography Integrated Naturally**:
   - Create an impactful, concise Japanese catchphrase (around 2 to 12 Japanese characters, short and memorable) based on the article's theme.
   - Specify that this Japanese catchphrase text (e.g., "キャッチコピー文言") is rendered in **large, highly legible Japanese lettering that integrates naturally and stylishly into the editorial design**.
   - **Strictly avoid**: heavy 3D extrusion, metallic textures, excessive glowing/neon effects, and realistic 3D lettering. Keep typography crisp, clean, and flat/sharp.
4. **Clean, Minimal & Modern Background**:
   - The background must be simple and low-information with generous clean negative space.
   - Ensure the overall impression is **modern, well-organized, and stylish** without visual clutter.
5. **Versatile & Dynamic Layout Compositions**:
   - Do NOT restrict layouts to just right/left asymmetrical splits. Choose the most suitable layout composition from these versatile patterns according to the article's theme and typography:
     - **Centered Title Layout**: A bold central title surrounded by harmonious editorial illustrations or thematic motifs.
     - **Top Title + Bottom Visual Layout**: A prominent title at the upper section with engaging editorial illustration artwork at the bottom.
     - **Banner / Band Header Layout**: A sleek colored bar or band holding the title text for clear editorial contrast.
     - **Speech Bubble / Sticker Accent Layout**: Sophisticated speech bubbles or modern sticker-like accent frames highlighting the key text.
     - **Diagonal Composition Layout**: Dynamic diagonal visual flow connecting typography and illustrative artwork.
     - **Circular / Rounded Panel Split Layout**: Clean rounded cards, panels, or circular shapes neatly dividing typography and illustrative elements.
   - **CRITICAL**: Always vary the layout choice dynamically so that generated thumbnails across different articles do not look repetitive or similar.

### HOW TO CONSTRUCT THE PROMPT
Construct a single, cohesive English image generation prompt that specifies:
- The modern, flat, sophisticated editorial illustration style tailored to the article's theme (using diverse subjects like metaphors, characters, objects, or conceptual art).
- The chosen layout composition (e.g., "Using a Circular / Rounded Panel Split Layout...", "Using a Top Title + Bottom Visual Layout...", etc.) and where each element is placed.
- The exact Japanese catchphrase string enclosed in quotes, integrated naturally into the design with clean, legible Japanese typography (avoiding heavy 3D or neon glow).
- The sophisticated bright-tone color palette (Sky Blue, Cyan, Mint, Coral, Pale Yellow, Off-White, Navy, etc.).
- The simple, low-information background that gives a modern, well-organized, and stylish impression.
- Negative constraints appended at the end.

### NEGATIVE CONSTRAINTS REQUIREMENT
STRICTLY append the following exclusion keywords at the very end of your prompt string:
"masterpiece --no realistic 3d rendering, heavy 3d text, metallic textures, excessive glow, neon lighting, highly saturated primary colors, messy typography, extra text, small unreadable characters, random English words, logos, watermarks, cluttered background"

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
