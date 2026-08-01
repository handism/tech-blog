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
  imagePrompt?: string;
  englishPrompt?: string;
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
自動特定します。その後、生成AI (gemini-3-pro-image) を用いてフラットなイラスト調で自然な日本語文言入りの図解インフォグラフィックを作成し、
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

  const imageModel = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3-pro-image';
  const requestedImageSize = process.env.GEMINI_IMAGE_SIZE ?? '1K';
  const imageSize = ['1K', '2K', '4K'].includes(requestedImageSize)
    ? (requestedImageSize as '1K' | '2K' | '4K')
    : '1K';

  const rawMarkdown = fs.readFileSync(mdPath, 'utf-8');
  const article = parseArticleFull(rawMarkdown);
  console.log(`[1/5] 記事 "md/${slug}.md" を読み込みました (タイトル: "${article.title}")`);

  const ai = new GoogleGenAI({ apiKey });

  const promptBuilderQuery = `
あなたは技術ブログのビジュアルデザイナーおよび図解インフォグラフィックのプロンプト作成エキスパートです。
以下の技術ブログ記事を分析してください：
- タイトル: "${article.title}"
- タグ: ${JSON.stringify(article.tags)}
- カテゴリ: "${article.category}"
- 本文 (Markdown):
${article.content.slice(0, 4000)}

以下のタスクを実行してください：
1. 本文の中で読者の理解を深めるために図解インフォグラフィックを挿入するのに最も適した箇所（見出しや主要な段落など）を1箇所だけ特定してください。できるだけ主要な見出し（例: "## ..."）や導入段落の直後を推奨します。
2. そのセクションで解説されている中心的な概念や仕組み、ワークフローなどを解説する図解インフォグラフィックを生成AI (gemini-3-pro-image) で作成するための詳細な画像生成プロンプト (imagePrompt) を作成してください。
3. 画像タグ用の分かりやすい日本語代替テキスト (altText) を作成してください。

【画像生成プロンプト (imagePrompt) 作成時の要件】
画像生成プロンプトには、以下の要件を必ず反映してください：
・写実的（フォトリアル）なデザインではなく、フラットなイラストのデザインを基本とすること。
・画像内に描画する見出し・ラベル・解説文字などの文言は、すべて自然な日本語とすること。
・細かい構図や配色、文字の配置、モチーフなどの表現方法は、AIの自由な創造的判断に任せること。
・対象セクションの内容を読者が視覚的に理解できるよう、記事内容に即した具体的な図解のテーマや解説内容（自然な日本語文言）をプロンプト内に指示すること。

出力フォーマット：
必ず以下のJSONスキーマに一致する1つのJSONオブジェクトのみを出力してください（Markdownコードブロックで囲まないこと）：
{
  "targetLineText": "記事内で画像を挿入する直前の行（正確なMarkdownの見出し行または段落テキスト。例: '## Gitの基本操作'）",
  "reason": "なぜここに図解を入れると分かりやすいかの理由（日本語）",
  "altText": "画像の代替テキスト（日本語。例: 'Gitの基本操作の図解イメージ'）",
  "imagePrompt": "gemini-3-pro-image に渡すための図解インフォグラフィック画像生成プロンプト（日本語）"
}
`.trim();

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
  const imagePrompt = plan.imagePrompt || plan.englishPrompt;
  if (!imagePrompt) {
    throw new Error('AIのレスポンスに画像生成プロンプト (imagePrompt) が含まれていませんでした。');
  }

  console.log(`       特定された挿入位置: "${plan.targetLineText}"`);
  console.log(`       挿入の理由: ${plan.reason}`);
  console.log(`       代替テキスト: "${plan.altText}"`);
  console.log(`       生成されたプロンプト:\n       "${imagePrompt}"`);

  console.log(`[3/5] ${imageModel} で図解インフォグラフィックを作成中...`);
  const interaction = await ai.interactions.create({
    model: imageModel,
    input: imagePrompt,
    response_format: {
      type: 'image',
      mime_type: 'image/jpeg',
      aspect_ratio: '16:9',
      image_size: imageSize,
    },
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
