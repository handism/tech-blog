import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';

interface ArticleMeta {
  title: string;
  tags: string[];
  category: string;
  content: string;
  frontmatter: string;
}

interface InfographicPlan {
  targetLineText: string;
  reason: string;
  altText: string;
  englishPrompt: string;
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
 * Markdown 文字列からフロントマターの主要項目および本文を抽出する。
 */
function parseArticleFull(rawMarkdown: string): ArticleMeta {
  let title = '';
  let tags: string[] = [];
  let category = '';
  let frontmatter = '';
  let content = rawMarkdown;

  const fmMatch = rawMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    frontmatter = fmMatch[0];
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
    content = rawMarkdown.slice(frontmatter.length).trim();
  }

  return {
    title: title || 'Tech Blog Article',
    tags,
    category: category || 'Tech',
    content,
    frontmatter,
  };
}

/**
 * AIからのJSONレスポンスを安全にパースする。
 */
function parseJsonSafe(text: string): InfographicPlan {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\r?\n?/i, '')
    .replace(/\r?\n?```$/i, '')
    .trim();
  try {
    return JSON.parse(cleaned) as InfographicPlan;
  } catch (e) {
    throw new Error(`AIからのJSONパースに失敗しました: ${text}\nエラー詳細: ${e}`);
  }
}

/**
 * 記事 Markdown 本文のターゲット位置にインフォグラフィック画像のMarkdownタグを挿入または更新する。
 */
function insertOrUpdateInfographic(
  filePath: string,
  plan: InfographicPlan,
  imageFilename: string
): void {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const imageTagRegex = new RegExp(
    `!\\[.*?\\]\\(/images/${imageFilename.replace(/\./g, '\\.')}\\)`,
    'g'
  );
  const newImageTag = `![${plan.altText}](/images/${imageFilename})`;

  // 既に同じ画像ファイル名が埋め込まれている場合は、タグ部分を更新（場所は変更しない）
  if (imageTagRegex.test(rawContent)) {
    const updatedContent = rawContent.replace(imageTagRegex, newImageTag);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`       既存のインフォグラフィック画像タグを更新しました: ${newImageTag}`);
    return;
  }

  const lines = rawContent.split(/\r?\n/);
  let targetIndex = -1;

  // 1) AIが選択したターゲット行（見出し等）を完全一致・部分一致で検索
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line &&
      (line === plan.targetLineText.trim() || line.includes(plan.targetLineText.trim()))
    ) {
      targetIndex = i;
      break;
    }
  }

  // 2) 見つからなかった場合のフォールバック: 最初に見つかった H2 見出し (## ) の行を探す
  if (targetIndex === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('## ')) {
        targetIndex = i;
        break;
      }
    }
  }

  // 3) それでも見つからなければフロントマター終了後（または先頭）をターゲットに
  if (targetIndex === -1) {
    targetIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---' && i > 0) {
        targetIndex = i;
        break;
      }
    }
  }

  // ターゲット行の直下に画像を挿入
  const newLines = [...lines];
  newLines.splice(targetIndex + 1, 0, '', newImageTag, '');
  fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
  console.log(`       記事本文の見出し/セクション ("${lines[targetIndex]}") の直下に図解を挿入しました。`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`使用方法: bun run gen-info <slug>

ブログ記事 (md/<slug>.md) の内容をAIで分析し、本文中の「いい感じの箇所（図解があると理解しやすいセクション）」を
自動特定します。その後、生成AI (gemini-3.1-flash-lite-image) を用いてシンプルでクリーンな図解インフォグラフィックを作成し、
16:9 (1024x576, WebP形式) にリサイズ・保存した上で、記事本文の該当位置にMarkdown画像リンクを設定します。
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
  const article = parseArticleFull(rawMarkdown);
  console.log(`[1/5] 記事 "md/${slug}.md" を読み込みました (タイトル: "${article.title}")`);

  const ai = new GoogleGenAI({ apiKey });

  const promptBuilderQuery = `
You are an expert technical blog visual designer and technical diagram prompt creator.
Analyze the following Japanese blog article:
- Title: "${article.title}"
- Tags: ${JSON.stringify(article.tags)}
- Category: "${article.category}"
- Content (Markdown):
${article.content.slice(0, 4000)}

Your task is to:
1. Identify the SINGLE best location in the Markdown content to insert a helpful infographic/diagram that illustrates the core concepts or workflows described in the article. Prefer inserting right AFTER a major heading (e.g. "## ...") or a key introductory paragraph.
2. Generate ONE detailed English image generation prompt for Google GenAI (gemini-3.1-flash-lite-image) that creates a clean, simple, and modern technical infographic diagram.
3. Provide a clear Japanese alt text for the markdown image tag.

MANDATORY STYLE RULES FOR THE PROMPT (must be reflected in englishPrompt):
- clean, simple, and modern minimalist technical infographic concept diagram illustrating the key architecture, workflow, or comparison from the target section
- use simple network lines, clean arrows, well-balanced colorful nodes, professional flowchart motifs, and clear geometric shapes
- modern minimalist palette with professional tech accent colors (e.g., muted blue, slate gray, teal, subtle orange) and generous whitespace
- white or light off-white neutral background, clean crisp edges, high legibility, uncluttered technical illustration
- DO NOT use pop-art style, ultra-bright saturated colors, or noisy decorative elements
- NEVER include text, letters, characters, typography, or words in the image
- STRICTLY append the following negative prompt keywords at the end of your prompt string:
  "masterpiece --no pop-art, superflat, neon, ultra-bright colors, gradients, messy shading, blurry lines, text, characters, watermark, letters, words, writing"

OUTPUT FORMAT:
Return exactly ONE JSON object matching this schema (do NOT wrap in markdown code blocks if possible, output valid JSON):
{
  "targetLineText": "The EXACT markdown heading line or paragraph text line from the article after which the image should be inserted (e.g. '## Gitの基本操作')",
  "reason": "なぜここに図解を入れると分かりやすいかの理由（日本語）",
  "altText": "画像の代替テキスト（日本語。例: 'Gitの基本操作イメージ図解'）",
  "englishPrompt": "The English prompt string for image generation"
}
`;

  console.log('[2/5] Gemini で記事本文を分析し、最適な図解挿入位置とプロンプトを構築中...');
  const textResponse = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: promptBuilderQuery,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawJsonText = textResponse.text || '{}';
  const plan = parseJsonSafe(rawJsonText);

  console.log(`       特定された挿入位置: "${plan.targetLineText}"`);
  console.log(`       挿入の理由: ${plan.reason}`);
  console.log(`       代替テキスト: "${plan.altText}"`);
  console.log(`       生成されたプロンプト:\n       "${plan.englishPrompt}"`);

  console.log('[3/5] Nano Banana 2 Lite (gemini-3.1-flash-lite-image) で図解インフォグラフィックを作成中...');
  const interaction = await ai.interactions.create({
    model: 'gemini-3.1-flash-lite-image',
    input: plan.englishPrompt,
  });

  const generatedImage = interaction.output_image;
  if (!generatedImage || !generatedImage.data) {
    throw new Error('画像生成APIから有効な画像データが返されませんでした。');
  }

  const imageBuffer = Buffer.from(generatedImage.data, 'base64');

  console.log(
    '[4/5] 画像を 16:9 (1024x576) にリサイズして WebP に変換・保存中...'
  );
  const outputDir = path.resolve(process.cwd(), 'public', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputFilename = `${slug}-infographic.webp`;
  const outputPath = path.resolve(outputDir, outputFilename);

  await sharp(imageBuffer)
    .resize(1024, 576, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toFile(outputPath);

  console.log(`       画像ファイルを保存しました: "public/images/${outputFilename}"`);

  console.log('[5/5] 記事のMarkdown本文へ図解インフォグラフィック画像を設定（挿入）中...');
  insertOrUpdateInfographic(mdPath, plan, outputFilename);
  console.log(`🎉 図解インフォグラフィックの作成と記事への設定が完了しました！`);
}

main().catch((err) => {
  console.error('エラーが発生しました:', err);
  process.exit(1);
});
