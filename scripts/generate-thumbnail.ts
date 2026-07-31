import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI } from '@google/genai';

type SharpFactory = (typeof import('sharp'))['default'];

interface ArticleMeta {
  title: string;
  tags: string[];
  category: string;
  contentExcerpt: string;
}

type LayoutType =
  | 'centered'
  | 'top-banner'
  | 'diagonal'
  | 'rounded-panels'
  | 'sticker'
  | 'split-band';

type PaletteKey = 'aqua-coral' | 'mint-sun' | 'sky-lavender' | 'coral-aqua' | 'blue-peach';

interface ThumbnailPlan {
  catchphrase: string;
  titleLines: string[];
  subLabel: string;
  layout: LayoutType;
  palette: PaletteKey;
  motif: string;
  supportingElements: string[];
}

interface CliOptions {
  slug: string;
  debug: boolean;
  reuseBg: boolean;
  layoutOverride?: LayoutType;
  catchphraseOverride?: string;
  labelOverride?: string;
}

interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
  soft: string;
}

interface TextBox {
  x: number;
  y: number;
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  align: 'start' | 'middle' | 'end';
  minFontSize: number;
  maxFontSize: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

const OUTPUT_WIDTH = 1024;
const OUTPUT_HEIGHT = 576;
const RENDER_SCALE = 2;
const RENDER_WIDTH = OUTPUT_WIDTH * RENDER_SCALE;
const RENDER_HEIGHT = OUTPUT_HEIGHT * RENDER_SCALE;

let PLAN_MODEL = 'gemini-3.5-flash-lite';
let IMAGE_MODEL = 'gemini-3-pro-image';
let IMAGE_SIZE: '1K' | '2K' | '4K' = '1K';
let FONT_FAMILY = 'LINE Seed JP';

function refreshRuntimeConfig(): void {
  PLAN_MODEL = process.env.GEMINI_PLAN_MODEL ?? 'gemini-3.5-flash-lite';
  IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3-pro-image';

  const requestedImageSize = process.env.GEMINI_IMAGE_SIZE ?? '1K';
  IMAGE_SIZE = ['1K', '2K', '4K'].includes(requestedImageSize)
    ? (requestedImageSize as '1K' | '2K' | '4K')
    : '1K';

  FONT_FAMILY = process.env.THUMB_FONT_FAMILY ?? 'LINE Seed JP';
}

const FONT_FAMILY_CANDIDATES = [
  'LINE Seed JP',
  'LINESeedJP',
  'LINE Seed JP ExtraBold',
  'LINESeedJP ExtraBold',
  'LINE Seed JP Bold',
  'LINESeedJP Bold',
  'LINE Seed JP App_OTF ExtraBold',
  'LINE Seed JP App_TTF ExtraBold',
  'LINE Seed JP App ExtraBold',
  'LINE Seed JP_OTF ExtraBold',
  'LINE Seed JP_TTF ExtraBold',
  'LINE Seed JP ExtraBold',
  'LINE Seed JP App_OTF',
  'LINE Seed JP App_TTF',
  'LINE Seed JP App',
  'LINE Seed JP_OTF',
  'LINE Seed JP_TTF',
];

const SVG_FONT_FAMILIES = [
  'ThumbTitle',
  'ThumbLabel',
  ...FONT_FAMILY_CANDIDATES.map((fam) => `'${fam}'`),
  'sans-serif',
].join(', ');
const DEFAULT_FONT_ROOTS = [
  path.resolve(process.cwd(), 'public', 'fonts', 'line-seed-jp'),
  path.resolve(process.cwd(), 'assets', 'fonts', 'line-seed-jp'),
];
const DEFAULT_FONT_ROOT = DEFAULT_FONT_ROOTS[0];

const LAYOUTS: LayoutType[] = [
  'centered',
  'top-banner',
  'diagonal',
  'rounded-panels',
  'sticker',
  'split-band',
];

const PALETTES: Record<PaletteKey, Palette> = {
  'aqua-coral': {
    primary: '#69BDD7',
    secondary: '#FF9183',
    accent: '#F2D576',
    dark: '#18334A',
    light: '#FFF9EF',
    soft: '#DFF4F2',
  },
  'mint-sun': {
    primary: '#88D4BC',
    secondary: '#F0C866',
    accent: '#73B7E2',
    dark: '#19364A',
    light: '#FFF9EE',
    soft: '#E6F4E8',
  },
  'sky-lavender': {
    primary: '#72B8E2',
    secondary: '#B7A8E5',
    accent: '#F1D27A',
    dark: '#1C314A',
    light: '#FFFAF2',
    soft: '#E8E6F6',
  },
  'coral-aqua': {
    primary: '#FF9484',
    secondary: '#75C9C1',
    accent: '#F3D477',
    dark: '#1A3448',
    light: '#FFF8EF',
    soft: '#FBE8DF',
  },
  'blue-peach': {
    primary: '#6EAEDF',
    secondary: '#F3B18B',
    accent: '#91D2BF',
    dark: '#19344C',
    light: '#FFF9F0',
    soft: '#E5F0F6',
  },
};

/**
 * .env.local から環境変数を手動ロードする。
 */
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

/**
 * Markdown のフロントマターと本文冒頭を抽出する。
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

/**
 * frontmatter の image を追記または上書きする。
 */
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeText(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function normalizeForComparison(value: string): string {
  return value.replace(/[\s　]/g, '').trim();
}

function parseCliArgs(args: string[]): CliOptions {
  const slugArg = args.find((arg) => !arg.startsWith('--'));
  if (!slugArg) throw new Error('記事 slug を指定してください。');

  const readOption = (name: string): string | undefined => {
    const prefix = `--${name}=`;
    return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  };

  const rawLayout = readOption('layout');
  const layoutOverride =
    rawLayout && LAYOUTS.includes(rawLayout as LayoutType) ? (rawLayout as LayoutType) : undefined;

  if (rawLayout && !layoutOverride) {
    throw new Error(`不正な layout です: ${rawLayout}\n利用可能: ${LAYOUTS.join(', ')}`);
  }

  return {
    slug: slugArg.endsWith('.md') ? slugArg.slice(0, -3) : slugArg,
    debug: args.includes('--debug'),
    reuseBg: args.includes('--reuse-bg') || args.includes('--recomposite'),
    layoutOverride,
    catchphraseOverride: readOption('title'),
    labelOverride: readOption('label'),
  };
}

function printHelp(): void {
  console.log(`使用方法:
  bun run gen-thumb <slug> [options]

Options:
  --debug                 背景・SVG・設計JSON・プロンプトも保存
  --reuse-bg              前回の無地背景を再利用し、AI生成をスキップしてSVG文字合成のみ実行 (別名: --recomposite)
  --layout=<layout>       レイアウトを固定
  --title=<日本語見出し>  キャッチコピーを上書き
  --label=<補助ラベル>    補助ラベルを上書き

Layouts:
  ${LAYOUTS.join(', ')}

Font:
  public/fonts/line-seed-jp 以下へ、Google Fonts (https://fonts.google.com/specimen/LINE+Seed+JP)
  または公式サイトから取得した LINE Seed JP の .ttf / .otf / .ttc を配置してください。
  (bun run dev または bun run build 実行時に自動ダウンロードされます)
`);
}

function findFontFiles(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) return [];

  const result: string[] = [];
  const walk = (currentDir: string): void => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(otf|ttf|ttc)$/i.test(entry.name)) {
        result.push(fullPath);
      }
    }
  };

  walk(rootDir);
  return result;
}

/**
 * sharp が読み込まれる前に fontconfig を構成する。
 * SVG 内へのフォント埋め込みは使わず、ローカルの LINE Seed JP を fontconfig 経由で解決する。
 */
function configureLocalFonts(): { fontRoot: string; fontFiles: string[]; configPath: string } {
  const configuredRoot = process.env.THUMB_FONT_DIR;
  const searchRoots = configuredRoot
    ? [path.resolve(process.cwd(), configuredRoot)]
    : DEFAULT_FONT_ROOTS;

  const fontFiles: string[] = [];
  for (const root of searchRoots) {
    fontFiles.push(...findFontFiles(root));
  }

  if (fontFiles.length === 0) {
    throw new Error(
      [
        'LINE Seed JP のフォントファイルが見つかりません。',
        `探索先: ${searchRoots.join(', ')}`,
        'Google Fonts (https://fonts.google.com/specimen/LINE+Seed+JP) または公式サイトから取得した .ttf / .otf / .ttc を配置してください。',
        'bun run dev や bun run build を実行すると自動的にダウンロードされます。',
        '別の場所を使う場合は .env.local の THUMB_FONT_DIR で指定できます。',
      ].join('\n')
    );
  }
  const fontRoot = searchRoots[0];

  const cacheRoot = path.resolve(process.cwd(), '.cache', 'thumbnail-fontconfig');
  const cacheDir = path.join(cacheRoot, 'cache');
  const configPath = path.join(cacheRoot, 'fonts.conf');
  fs.mkdirSync(cacheDir, { recursive: true });

  const fontDirs = [...new Set(fontFiles.map((file) => path.dirname(file)))];
  const preferXml = FONT_FAMILY_CANDIDATES.map(
    (fam) => `      <family>${escapeXml(fam)}</family>`
  ).join('\n');

  const configXml = `<?xml version="1.0"?>
<fontconfig>
${fontDirs.map((dir) => `  <dir>${escapeXml(dir)}</dir>`).join('\n')}
  <cachedir>${escapeXml(cacheDir)}</cachedir>
  <alias>
    <family>ThumbTitle</family>
    <prefer>
${preferXml}
    </prefer>
  </alias>
  <alias>
    <family>ThumbLabel</family>
    <prefer>
${preferXml}
    </prefer>
  </alias>
</fontconfig>
`;

  fs.mkdirSync(cacheRoot, { recursive: true });
  fs.writeFileSync(configPath, configXml, 'utf-8');

  process.env.FONTCONFIG_FILE = configPath;
  process.env.FONTCONFIG_PATH = cacheRoot;
  process.env.PANGOCAIRO_BACKEND = 'fontconfig';

  return { fontRoot, fontFiles, configPath };
}

async function loadSharpWithLocalFonts(): Promise<SharpFactory> {
  const fontInfo = configureLocalFonts();
  console.log(
    `       LINE Seed JP をローカルフォントとして登録しました (${fontInfo.fontFiles.length} files)`
  );
  console.log(`       fontconfig: ${fontInfo.configPath}`);

  const sharpModule = await import('sharp');
  return sharpModule.default;
}

const BG_CACHE_DIR = path.resolve(process.cwd(), '.cache', 'thumbnail-backgrounds');

function saveBackgroundCache(slug: string, imageBuffer: Buffer, plan: ThumbnailPlan): void {
  fs.mkdirSync(BG_CACHE_DIR, { recursive: true });
  const bgPath = path.join(BG_CACHE_DIR, `${slug}.bg.png`);
  const planPath = path.join(BG_CACHE_DIR, `${slug}.plan.json`);
  fs.writeFileSync(bgPath, imageBuffer);
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf-8');
}

function loadBackgroundCache(
  slug: string
): { imageBuffer: Buffer; plan: ThumbnailPlan } | undefined {
  const bgPath = path.join(BG_CACHE_DIR, `${slug}.bg.png`);
  const planPath = path.join(BG_CACHE_DIR, `${slug}.plan.json`);
  if (!fs.existsSync(bgPath) || !fs.existsSync(planPath)) {
    return undefined;
  }
  const imageBuffer = fs.readFileSync(bgPath);
  const planJson = fs.readFileSync(planPath, 'utf-8');
  const plan = JSON.parse(planJson) as ThumbnailPlan;
  return { imageBuffer, plan };
}

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  throw new Error(`JSON を抽出できませんでした。応答: ${text}`);
}

function isLayout(value: unknown): value is LayoutType {
  return typeof value === 'string' && LAYOUTS.includes(value as LayoutType);
}

function isPalette(value: unknown): value is PaletteKey {
  return typeof value === 'string' && value in PALETTES;
}

function visualUnits(text: string): number {
  let units = 0;
  for (const char of [...text]) {
    if (/\s/.test(char)) units += 0.35;
    else if (/[A-Za-z0-9]/.test(char)) units += 0.58;
    else if (/[.,:;!?+\-–—/()（）「」『』【】]/.test(char)) units += 0.52;
    else units += 1;
  }
  return units;
}

function findBestBreakIndex(text: string): number {
  const chars = [...text];
  const target = visualUnits(text) / 2;
  const preferredAfter = /[・/:：—－+×]/;
  const preferredBefore = /[とをがはへでのに]/;

  let accumulated = 0;
  let bestIndex = Math.ceil(chars.length / 2);
  let bestScore = Number.POSITIVE_INFINITY;

  for (let index = 1; index < chars.length; index += 1) {
    accumulated += visualUnits(chars[index - 1]);
    const balancePenalty = Math.abs(accumulated - target);
    const breakBonus = preferredAfter.test(chars[index - 1]) ? -1.4 : 0;
    const particlePenalty = preferredBefore.test(chars[index]) ? 0.7 : 0;
    const edgePenalty = index < 2 || chars.length - index < 2 ? 3 : 0;
    const score = balancePenalty + breakBonus + particlePenalty + edgePenalty;

    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  }

  return bestIndex;
}

function autoSplitTitle(catchphrase: string): string[] {
  const clean = normalizeText(catchphrase).replace(/\s+/g, '');
  if (visualUnits(clean) <= 8.5) return [clean];

  const index = findBestBreakIndex(clean);
  return [clean.slice(0, index), clean.slice(index)].filter(Boolean);
}

function normalizeSubLabel(raw: unknown): string {
  const cleaned = normalizeText(String(raw || ''));
  if (!cleaned) return '';

  const words = cleaned.split(/\s+/);
  if (words.length > 1) {
    let candidate = words[0];
    for (let index = 1; index < words.length; index += 1) {
      const next = `${candidate} ${words[index]}`;
      if (visualUnits(next) <= 6.5 && next.length <= 12) {
        candidate = next;
      } else {
        break;
      }
    }
    if (candidate.length <= 12 && visualUnits(candidate) <= 7.5) {
      return candidate;
    }
  }

  if (cleaned.length <= 12 && visualUnits(cleaned) <= 7.5) {
    return cleaned;
  }
  return cleaned.slice(0, 12);
}

function normalizePlan(raw: Record<string, unknown>): ThumbnailPlan {
  const catchphrase = normalizeText(String(raw.catchphrase || '技術を解剖')).slice(0, 28);
  const rawLines = Array.isArray(raw.titleLines)
    ? raw.titleLines
        .map((line) => normalizeText(String(line)))
        .filter(Boolean)
        .slice(0, 2)
    : [];

  const validLines =
    rawLines.length > 0 &&
    normalizeForComparison(rawLines.join('')) === normalizeForComparison(catchphrase);

  return {
    catchphrase,
    titleLines: validLines ? rawLines : autoSplitTitle(catchphrase),
    subLabel: normalizeSubLabel(raw.subLabel),
    layout: isLayout(raw.layout) ? raw.layout : 'top-banner',
    palette: isPalette(raw.palette) ? raw.palette : 'aqua-coral',
    motif: normalizeText(String(raw.motif || 'abstract software development workflow')).slice(
      0,
      700
    ),
    supportingElements: Array.isArray(raw.supportingElements)
      ? raw.supportingElements
          .map((item) => normalizeText(String(item)))
          .filter(Boolean)
          .slice(0, 4)
      : [],
  };
}

function applyOverrides(plan: ThumbnailPlan, options: CliOptions): ThumbnailPlan {
  const catchphrase = options.catchphraseOverride
    ? normalizeText(options.catchphraseOverride)
    : plan.catchphrase;

  return {
    ...plan,
    catchphrase,
    titleLines: options.catchphraseOverride ? autoSplitTitle(catchphrase) : plan.titleLines,
    subLabel:
      options.labelOverride !== undefined
        ? normalizeSubLabel(options.labelOverride)
        : plan.subLabel,
    layout: options.layoutOverride ?? plan.layout,
  };
}

const THUMBNAIL_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'catchphrase',
    'titleLines',
    'subLabel',
    'layout',
    'palette',
    'motif',
    'supportingElements',
  ],
  properties: {
    catchphrase: {
      type: 'string',
      description: 'Concise Japanese thumbnail headline. Prefer 4 to 14 Japanese characters.',
    },
    titleLines: {
      type: 'array',
      minItems: 1,
      maxItems: 2,
      items: { type: 'string' },
      description: 'One or two lines whose concatenation exactly equals catchphrase.',
    },
    subLabel: {
      type: 'string',
      description:
        'Optional short label (2 to 6 characters, e.g. "2026", "入門", "AWS", "解説"). Empty string if unnecessary. Never use long English words.',
    },
    layout: {
      type: 'string',
      enum: LAYOUTS,
    },
    palette: {
      type: 'string',
      enum: Object.keys(PALETTES),
    },
    motif: {
      type: 'string',
      description: 'English description of one clear central flat-illustration metaphor.',
    },
    supportingElements: {
      type: 'array',
      maxItems: 4,
      items: { type: 'string' },
    },
  },
} as const;

async function generateThumbnailPlan(
  ai: GoogleGenAI,
  article: ArticleMeta
): Promise<ThumbnailPlan> {
  const articleJson = JSON.stringify(article, null, 2);
  const prompt = `
You are the creative director of a refined Japanese technology YouTube channel.
Analyze the following article and produce a compact thumbnail design plan as JSON.

ARTICLE:
${articleJson}

DESIGN DIRECTION:
- The thumbnail must be immediately understandable at smartphone size.
- It should have the visual impact of a YouTube thumbnail, but not cheap clickbait styling.
- Use modern flat editorial illustration, generous shapes, deliberate negative space, and strong visual hierarchy.
- The main headline should be short. Move a short year, edition, or category marker into subLabel (2-6 chars, e.g. "2026", "入門", "AWS", "図解"). Keep subLabel extremely compact; never use long English words like "BACKEND ARCHITECTURE".
- titleLines must contain one or two natural lines. Joining titleLines without spaces must equal catchphrase.
- Choose one layout from the allowed enum based on the article concept.
- Choose one palette from the allowed enum.
- Use one dominant metaphor rather than a collection of generic coding icons.
- Do not put text into motif or supportingElements. The background image will contain no typography.
- Avoid generic presentation-slide layouts, tiny UI screenshots, stock-vector scenes, and excessive floating cards.
`.trim();

  const response = await ai.models.generateContent({
    model: PLAN_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: THUMBNAIL_PLAN_SCHEMA,
      temperature: 0.75,
    },
  });

  const rawText = (response.text || '').trim();
  if (!rawText) throw new Error('サムネイル設計JSONが空でした。');

  const parsed = JSON.parse(extractJsonObject(rawText)) as Record<string, unknown>;
  return normalizePlan(parsed);
}

function palettePrompt(paletteKey: PaletteKey): string {
  const p = PALETTES[paletteKey];
  return `
Use this coordinated bright-tone palette:
- primary ${p.primary}
- secondary ${p.secondary}
- accent ${p.accent}
- deep navy ${p.dark}
- warm off-white ${p.light}
- soft supporting tone ${p.soft}
Keep saturation fresh but controlled. Do not replace it with pure RGB primary colors.
`.trim();
}

function backgroundLayoutInstruction(layout: LayoutType): string {
  switch (layout) {
    case 'centered':
      return `Build the composition around the outer edges and reserve the central 58% width and middle 38% height as calm title-safe negative space. Let the illustration frame the title area rather than sit behind it.`;
    case 'top-banner':
      return `Reserve the upper 35% of the canvas as calm title-safe negative space. Concentrate the main metaphor in the lower half, with a few shapes gently rising toward the sides.`;
    case 'diagonal':
      return `Create a strong diagonal flow from upper left to lower right. Keep the left-center diagonal zone quiet for typography and place the main metaphor toward the right and lower-right.`;
    case 'rounded-panels':
      return `Reserve the left 46% as a calm title-safe area shaped by one large soft rounded region. Place the main illustration on the right, with minimal overlap.`;
    case 'sticker':
      return `Keep the lower-right 45% visually quiet for a floating headline sticker. Place the main metaphor slightly left of center and keep the upper-left available for a small label.`;
    case 'split-band':
      return `Reserve the bottom 31% as a calm title-safe band. Place the main metaphor in the upper two-thirds and prevent important details from entering the bottom band.`;
  }
}

function buildBackgroundPrompt(plan: ThumbnailPlan): string {
  const supporting = plan.supportingElements.length
    ? `Supporting visual accents: ${plan.supportingElements.join(', ')}.`
    : 'Use only two or three restrained supporting accents.';

  return `
Create a polished 16:9 background illustration for a Japanese technology YouTube thumbnail.

ABSOLUTE RULE:
This is a background-only image. Render no text, no letters, no numbers, no logos, no code snippets, and no readable UI labels anywhere.

ART DIRECTION:
- Contemporary flat editorial illustration with confident custom shapes.
- Refined, friendly, design-forward, and suitable for a premium Japanese technology channel.
- Flat vector-like construction with subtle depth from overlap and restrained soft shadows only.
- One clear visual metaphor that communicates the article instantly.
- Avoid the look of a generic stock-vector business illustration or presentation slide.
- Avoid photorealism, glossy 3D CGI, metallic objects, neon lighting, and dense miniature details.

COMPOSITION:
${backgroundLayoutInstruction(plan.layout)}
Do not draw a literal empty white rectangle for the title. Create natural negative space using composition, color fields, and cropped shapes.

MAIN METAPHOR:
${plan.motif}
${supporting}

COLOR:
${palettePrompt(plan.palette)}

QUALITY:
Strong silhouette, balanced scale, deliberate asymmetry, clean edges, limited element count, and enough contrast to remain legible behind an added typography layer.

--no typography, text, letters, numbers, random symbols, logos, watermarks, readable code, realistic photography, realistic 3D rendering, metallic textures, glossy product render, neon glow, harsh primary color blocking, generic stock vector scene, tiny floating UI cards, clutter
`.trim();
}

function fitFontSize(lines: string[], box: TextBox): number {
  const maxUnits = Math.max(...lines.map(visualUnits), 1);
  const availableWidth = Math.max(1, box.width - box.paddingX * 2);
  const availableHeight = Math.max(1, box.height - box.paddingY * 2);
  const widthBased = availableWidth / (maxUnits * 1.01);
  const blockEm = lines.length === 1 ? 0.96 : 0.96 + (lines.length - 1) * 1.08;
  const heightBased = availableHeight / blockEm;

  return Math.floor(clamp(Math.min(widthBased, heightBased), box.minFontSize, box.maxFontSize));
}

function renderTitleText(lines: string[], box: TextBox): string {
  const fontSize = fitFontSize(lines, box);
  const lineHeight = fontSize * 1.08;
  const blockHeight = fontSize * 0.96 + (lines.length - 1) * lineHeight;
  const firstBaseline = box.y + (box.height - blockHeight) / 2 + fontSize * 0.82;

  const x =
    box.align === 'middle'
      ? box.x + box.width / 2
      : box.align === 'end'
        ? box.x + box.width - box.paddingX
        : box.x + box.paddingX;

  const strokeAttributes = box.stroke
    ? `stroke="${box.stroke}" stroke-width="${box.strokeWidth ?? 2}" paint-order="stroke fill"`
    : '';

  const tspans = lines
    .map(
      (line, index) =>
        `<tspan x="${x}" y="${firstBaseline + index * lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join('');

  return `<text
    font-family="${SVG_FONT_FAMILIES}"
    font-size="${fontSize}"
    font-weight="800"
    text-anchor="${box.align}"
    fill="${box.fill}"
    ${strokeAttributes}
    stroke-linejoin="round"
    letter-spacing="0.2"
    class="title-text"
  >${tspans}</text>`;
}

function labelWidth(label: string, fontSize = 24): number {
  return clamp(Math.ceil(visualUnits(label) * fontSize + 42), 112, 310);
}

function fitSubLabelFontSize(
  label: string,
  maxTextWidth: number,
  defaultFontSize = 24,
  minFontSize = 13
): number {
  const units = Math.max(visualUnits(label), 1);
  const requiredWidth = units * defaultFontSize;
  if (requiredWidth <= maxTextWidth) {
    return defaultFontSize;
  }
  return clamp(Math.floor(maxTextWidth / units), minFontSize, defaultFontSize);
}

function renderLabel(params: {
  label: string;
  x: number;
  y: number;
  fill: string;
  textFill: string;
  rotate?: number;
  fontSize?: number;
  height?: number;
}): string {
  if (!params.label) return '';

  const defaultFontSize = params.fontSize ?? 24;
  const height = params.height ?? 48;
  const width = labelWidth(params.label, defaultFontSize);
  const fontSize = fitSubLabelFontSize(params.label, width - 36, defaultFontSize, 13);
  const centerX = params.x + width / 2;
  const centerY = params.y + height / 2;
  const transform = params.rotate
    ? ` transform="rotate(${params.rotate} ${centerX} ${centerY})"`
    : '';

  return `<g${transform} class="small-shadow">
    <rect x="${params.x}" y="${params.y}" width="${width}" height="${height}" rx="${height / 2}" fill="${params.fill}" />
    <text
      x="${centerX}"
      y="${params.y + height * 0.67}"
      text-anchor="middle"
      font-family="${SVG_FONT_FAMILIES}"
      font-size="${fontSize}"
      font-weight="800"
      fill="${params.textFill}"
      letter-spacing="0.3"
    >${escapeXml(params.label)}</text>
  </g>`;
}

function buildTopBannerOverlay(plan: ThumbnailPlan, p: Palette): string {
  const panelHeight = plan.titleLines.length === 1 ? 152 : 202;
  const panelY = 82;

  return `
  <g class="panel-shadow">
    <rect x="46" y="${panelY}" width="932" height="${panelHeight}" rx="34" fill="${p.light}" fill-opacity="0.96" />
    <rect x="46" y="${panelY}" width="18" height="${panelHeight}" rx="9" fill="${p.primary}" />
    <rect x="80" y="${panelY + panelHeight - 18}" width="170" height="7" rx="3.5" fill="${p.secondary}" />
  </g>
  ${renderLabel({
    label: plan.subLabel,
    x: 72,
    y: 28,
    fill: p.accent,
    textFill: p.dark,
  })}
  ${renderTitleText(plan.titleLines, {
    x: 76,
    y: panelY + 12,
    width: 850,
    height: panelHeight - 24,
    paddingX: 18,
    paddingY: 8,
    align: 'start',
    minFontSize: 48,
    maxFontSize: 88,
    fill: p.dark,
  })}
  `;
}

function buildCenteredOverlay(plan: ThumbnailPlan, p: Palette): string {
  const panelHeight = plan.titleLines.length === 1 ? 178 : 232;
  const panelY = (OUTPUT_HEIGHT - panelHeight) / 2 + 10;

  return `
  <g class="panel-shadow">
    <rect x="138" y="${panelY}" width="748" height="${panelHeight}" rx="42" fill="${p.dark}" fill-opacity="0.94" />
    <circle cx="166" cy="${panelY + 28}" r="8" fill="${p.secondary}" />
    <circle cx="858" cy="${panelY + panelHeight - 28}" r="11" fill="${p.primary}" />
    <path d="M184 ${panelY + panelHeight - 22} H322" stroke="${p.accent}" stroke-width="7" stroke-linecap="round" />
  </g>
  ${renderLabel({
    label: plan.subLabel,
    x: 512 - labelWidth(plan.subLabel || ' ', 23) / 2,
    y: panelY - 28,
    fill: p.accent,
    textFill: p.dark,
    fontSize: 23,
  })}
  ${renderTitleText(plan.titleLines, {
    x: 174,
    y: panelY + 20,
    width: 676,
    height: panelHeight - 40,
    paddingX: 24,
    paddingY: 10,
    align: 'middle',
    minFontSize: 48,
    maxFontSize: 86,
    fill: p.light,
  })}
  `;
}

function buildDiagonalOverlay(plan: ThumbnailPlan, p: Palette): string {
  const titleHeight = plan.titleLines.length === 1 ? 148 : 214;

  return `
  <g class="panel-shadow">
    <path d="M42 92 L650 34 Q684 30 704 58 L654 ${titleHeight + 130} Q646 ${titleHeight + 158} 614 ${titleHeight + 164} L78 ${titleHeight + 226} Q44 ${titleHeight + 230} 38 ${titleHeight + 196} Z" fill="${p.accent}" fill-opacity="0.96" />
    <path d="M52 ${titleHeight + 200} L314 ${titleHeight + 172}" stroke="${p.secondary}" stroke-width="9" stroke-linecap="round" />
  </g>
  ${renderLabel({
    label: plan.subLabel,
    x: 72,
    y: 40,
    fill: p.primary,
    textFill: p.light,
    rotate: -3,
  })}
  ${renderTitleText(plan.titleLines, {
    x: 72,
    y: 112,
    width: 560,
    height: titleHeight,
    paddingX: 28,
    paddingY: 8,
    align: 'start',
    minFontSize: 48,
    maxFontSize: 86,
    fill: p.dark,
  })}
  `;
}

function buildRoundedPanelsOverlay(plan: ThumbnailPlan, p: Palette): string {
  return `
  <g class="panel-shadow">
    <rect x="44" y="58" width="446" height="462" rx="48" fill="${p.light}" fill-opacity="0.94" />
    <rect x="68" y="82" width="112" height="12" rx="6" fill="${p.primary}" />
    <circle cx="452" cy="98" r="17" fill="${p.secondary}" />
    <circle cx="88" cy="486" r="10" fill="${p.accent}" />
  </g>
  ${renderLabel({
    label: plan.subLabel,
    x: 72,
    y: 112,
    fill: p.soft,
    textFill: p.dark,
    fontSize: 22,
    height: 44,
  })}
  ${renderTitleText(plan.titleLines, {
    x: 70,
    y: 170,
    width: 392,
    height: 280,
    paddingX: 18,
    paddingY: 14,
    align: 'start',
    minFontSize: 46,
    maxFontSize: 78,
    fill: p.dark,
  })}
  <path d="M72 466 H256" stroke="${p.secondary}" stroke-width="8" stroke-linecap="round" />
  `;
}

function buildStickerOverlay(plan: ThumbnailPlan, p: Palette): string {
  const panelHeight = plan.titleLines.length === 1 ? 142 : 194;
  const panelY = 576 - panelHeight - 48;

  return `
  ${renderLabel({
    label: plan.subLabel,
    x: 54,
    y: 42,
    fill: p.accent,
    textFill: p.dark,
    rotate: -5,
  })}
  <g transform="rotate(-2 744 ${panelY + panelHeight / 2})" class="panel-shadow">
    <path d="M500 ${panelY + 8} Q500 ${panelY - 8} 518 ${panelY - 8} H938 Q962 ${panelY - 8} 962 ${panelY + 18} V${panelY + panelHeight - 22} Q962 ${panelY + panelHeight} 938 ${panelY + panelHeight} H548 L510 ${panelY + panelHeight + 26} L518 ${panelY + panelHeight} Q500 ${panelY + panelHeight} 500 ${panelY + panelHeight - 18} Z" fill="${p.secondary}" />
    <circle cx="930" cy="${panelY + 24}" r="9" fill="${p.accent}" />
    ${renderTitleText(plan.titleLines, {
      x: 526,
      y: panelY + 10,
      width: 408,
      height: panelHeight - 18,
      paddingX: 18,
      paddingY: 8,
      align: 'middle',
      minFontSize: 44,
      maxFontSize: 76,
      fill: p.light,
      stroke: p.dark,
      strokeWidth: 2.2,
    })}
  </g>
  `;
}

function buildSplitBandOverlay(plan: ThumbnailPlan, p: Palette): string {
  const bandY = 382;
  const bandHeight = 150;

  return `
  <g class="panel-shadow">
    <rect x="42" y="${bandY}" width="940" height="${bandHeight}" rx="34" fill="${p.dark}" fill-opacity="0.95" />
    <rect x="42" y="${bandY}" width="216" height="${bandHeight}" rx="34" fill="${p.primary}" />
    <rect x="224" y="${bandY}" width="38" height="${bandHeight}" fill="${p.primary}" />
  </g>
  ${
    plan.subLabel
      ? (() => {
          const fontSize = fitSubLabelFontSize(plan.subLabel, 170, 27, 14);
          return `<text
        x="150"
        y="${bandY + 86}"
        text-anchor="middle"
        font-family="${SVG_FONT_FAMILIES}"
        font-size="${fontSize}"
        font-weight="800"
        fill="${p.light}"
      >${escapeXml(plan.subLabel)}</text>`;
        })()
      : `<circle cx="150" cy="${bandY + 75}" r="25" fill="${p.accent}" />`
  }
  ${renderTitleText(plan.titleLines, {
    x: 272,
    y: bandY + 12,
    width: 680,
    height: bandHeight - 24,
    paddingX: 12,
    paddingY: 4,
    align: 'start',
    minFontSize: 44,
    maxFontSize: 76,
    fill: p.light,
  })}
  `;
}

function buildOverlaySvg(plan: ThumbnailPlan): string {
  const p = PALETTES[plan.palette];

  const body = (() => {
    switch (plan.layout) {
      case 'centered':
        return buildCenteredOverlay(plan, p);
      case 'top-banner':
        return buildTopBannerOverlay(plan, p);
      case 'diagonal':
        return buildDiagonalOverlay(plan, p);
      case 'rounded-panels':
        return buildRoundedPanelsOverlay(plan, p);
      case 'sticker':
        return buildStickerOverlay(plan, p);
      case 'split-band':
        return buildSplitBandOverlay(plan, p);
    }
  })();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${RENDER_WIDTH}"
  height="${RENDER_HEIGHT}"
  viewBox="0 0 ${OUTPUT_WIDTH} ${OUTPUT_HEIGHT}"
>
  <defs>
    <filter id="panelShadow" x="-20%" y="-25%" width="150%" height="170%">
      <feDropShadow dx="0" dy="8" stdDeviation="11" flood-color="${p.dark}" flood-opacity="0.18" />
    </filter>
    <filter id="smallShadow" x="-25%" y="-35%" width="160%" height="190%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="${p.dark}" flood-opacity="0.16" />
    </filter>
    <style><![CDATA[
      .panel-shadow { filter: url(#panelShadow); }
      .small-shadow { filter: url(#smallShadow); }
      .title-text { font-kerning: normal; }
    ]]></style>
  </defs>
  ${body}
</svg>`;
}

async function saveDebugArtifacts(params: {
  outputDir: string;
  slug: string;
  plan: ThumbnailPlan;
  backgroundPrompt: string;
  imageBuffer: Buffer;
  overlaySvg: string;
  sharp: SharpFactory;
}): Promise<void> {
  const debugDir = path.join(params.outputDir, '_thumb-debug', params.slug);
  fs.mkdirSync(debugDir, { recursive: true });

  fs.writeFileSync(
    path.join(debugDir, 'plan.json'),
    `${JSON.stringify(params.plan, null, 2)}\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(debugDir, 'background-prompt.txt'),
    `${params.backgroundPrompt}\n`,
    'utf-8'
  );
  fs.writeFileSync(path.join(debugDir, 'overlay.svg'), params.overlaySvg, 'utf-8');

  await params
    .sharp(params.imageBuffer)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: 'cover', position: 'centre' })
    .webp({ quality: 88 })
    .toFile(path.join(debugDir, 'background.webp'));

  console.log(`       デバッグ素材: ${debugDir}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  loadEnvLocal();
  refreshRuntimeConfig();
  const options = parseCliArgs(args);
  const mdPath = path.resolve(process.cwd(), 'md', `${options.slug}.md`);

  if (!fs.existsSync(mdPath)) {
    throw new Error(`記事ファイルが見つかりません: ${mdPath}`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('.env.local に GEMINI_API_KEY=<APIキー> を設定してください。');
  }

  // 必ず sharp の import より前に fontconfig を設定する。
  const sharp = await loadSharpWithLocalFonts();

  const rawMarkdown = fs.readFileSync(mdPath, 'utf-8');
  const article = parseArticle(rawMarkdown);
  console.log(`[1/6] 記事を読み込みました: "${article.title}"`);

  const ai = new GoogleGenAI({ apiKey });

  let plan: ThumbnailPlan;
  let imageBuffer: Buffer;
  let backgroundPrompt = '';

  if (options.reuseBg) {
    console.log(`[2/6] キャッシュされた無地背景・設計JSONを読み込み中... (--reuse-bg)`);
    const cached = loadBackgroundCache(options.slug);
    if (!cached) {
      throw new Error(
        `キャッシュされた無地背景が見つかりません (${options.slug})。\nまずは通常コマンドで再生成を行ってください: bun run gen-thumb ${options.slug}`
      );
    }
    plan = applyOverrides(cached.plan, options);
    imageBuffer = cached.imageBuffer;
    console.log(`       ${JSON.stringify(plan, null, 2).replace(/\n/g, '\n       ')}`);
    console.log('[3/6] (スキップ: プロンプト構築 - キャッシュ再利用)');
    console.log('[4/6] (スキップ: AI背景画像生成 - キャッシュ再利用)');
  } else {
    console.log(`[2/6] ${PLAN_MODEL} でサムネイル設計を生成中...`);
    const generatedPlan = await generateThumbnailPlan(ai, article);
    plan = applyOverrides(generatedPlan, options);
    console.log(`       ${JSON.stringify(plan, null, 2).replace(/\n/g, '\n       ')}`);

    console.log('[3/6] 文字なし背景プロンプトを構築中...');
    backgroundPrompt = buildBackgroundPrompt(plan);

    console.log(`[4/6] ${IMAGE_MODEL} で16:9背景画像を生成中...`);
    const interaction = await ai.interactions.create({
      model: IMAGE_MODEL,
      input: backgroundPrompt,
      response_format: {
        type: 'image',
        mime_type: 'image/jpeg',
        aspect_ratio: '16:9',
        image_size: IMAGE_SIZE,
      },
    });

    const generatedImage = interaction.output_image;
    if (!generatedImage?.data) {
      throw new Error('画像生成APIから画像データが返されませんでした。');
    }

    imageBuffer = Buffer.from(generatedImage.data, 'base64');
    saveBackgroundCache(options.slug, imageBuffer, plan);
  }
  const overlaySvg = buildOverlaySvg(plan);

  const outputDir = path.resolve(process.cwd(), 'public', 'images');
  fs.mkdirSync(outputDir, { recursive: true });

  if (options.debug) {
    await saveDebugArtifacts({
      outputDir,
      slug: options.slug,
      plan,
      backgroundPrompt,
      imageBuffer,
      overlaySvg,
      sharp,
    });
  }

  console.log('[5/6] 2倍解像度で文字を合成し、1024×576へ縮小中...');
  const background2x = await sharp(imageBuffer)
    .resize(RENDER_WIDTH, RENDER_HEIGHT, {
      fit: 'cover',
      position: 'centre',
    })
    .png()
    .toBuffer();

  const composited2x = await sharp(background2x)
    .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  const outputFilename = `${options.slug}-thumb.webp`;
  const outputPath = path.join(outputDir, outputFilename);

  await sharp(composited2x)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: 'fill',
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 91, effort: 5 })
    .toFile(outputPath);

  console.log(`[6/6] 保存しました: public/images/${outputFilename}`);
  updateArticleFrontmatter(mdPath, outputFilename);
  console.log('🎉 サムネイル生成が完了しました。');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack || error.message : String(error);
  console.error(`\nエラーが発生しました:\n${message}`);
  process.exit(1);
});
