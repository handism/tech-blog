import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import {
  DEFAULT_PLAN_MODEL,
  ensureImagesDir,
  extractJsonObject,
  generateImage,
  loadEnvLocal,
  normalizeSlug,
  readArticle,
  requireGeminiApiKey,
  resolveArticlePath,
  resolveImageConfig,
  runMain,
} from './lib/article-gen';

interface InfographicPlan {
  targetLineText: string;
  reason: string;
  altText: string;
  imagePrompt?: string;
  englishPrompt?: string;
}

/**
 * AIからのJSONレスポンスを安全にパースする。
 */
function parsePlan(text: string): InfographicPlan {
  try {
    return JSON.parse(extractJsonObject(text)) as InfographicPlan;
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

  const slug = normalizeSlug(args[0]);
  const mdPath = resolveArticlePath(slug);

  loadEnvLocal();
  const apiKey = requireGeminiApiKey();
  const { imageModel, imageSize } = resolveImageConfig();

  const article = readArticle(mdPath);
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
    model: process.env.GEMINI_PLAN_MODEL ?? DEFAULT_PLAN_MODEL,
    contents: promptBuilderQuery,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const plan = parsePlan(textResponse.text || '{}');
  const imagePrompt = plan.imagePrompt || plan.englishPrompt;
  if (!imagePrompt) {
    throw new Error('AIのレスポンスに画像生成プロンプト (imagePrompt) が含まれていませんでした。');
  }

  console.log(`       特定された挿入位置: "${plan.targetLineText}"`);
  console.log(`       挿入の理由: ${plan.reason}`);
  console.log(`       代替テキスト: "${plan.altText}"`);
  console.log(`       生成されたプロンプト:\n       "${imagePrompt}"`);

  console.log(`[3/5] ${imageModel} で図解インフォグラフィックを作成中...`);
  const imageBuffer = await generateImage(ai, { model: imageModel, prompt: imagePrompt, imageSize });

  console.log(
    '[4/5] 画像を 16:9 (1024x576) にリサイズして WebP に変換・保存中...'
  );
  const outputDir = ensureImagesDir();
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

runMain(main);
