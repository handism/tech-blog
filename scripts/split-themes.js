// scripts/split-themes.js
const fs = require('fs');
const path = require('path');

const globalsCssPath = path.join(__dirname, '../app/globals.css');
const destDir = path.join(__dirname, '../public/themes');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const content = fs.readFileSync(globalsCssPath, 'utf-8');
const lines = content.split('\n');

// 共通ベーススタイルとテーマ別定義の分割位置を特定
// 行 527 (インデックス 526) 付近: /* ── Neo-Brutalism (デフォルト) ── */
let splitIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('/* ── Neo-Brutalism (デフォルト) ── */') || lines[i].includes('デザインテーマ システム')) {
    splitIndex = i;
    break;
  }
}

if (splitIndex === -1) {
  console.error('Split point not found!');
  process.exit(1);
}

const baseCss = lines.slice(0, splitIndex).join('\n');
const themeCssLines = lines.slice(splitIndex);

// テーマIDのリスト (site.ts から抽出したもの)
const themeIds = [
  'minimal', 'flat', 'material', 'corporate', 'dashboard', 'bento', 'hekireki',
  'glassmorphism', 'neumorphism', 'claymorphism', 'skeuomorphism', 'isometric', 'three-d',
  'retro', 'cyberpunk', 'synthwave', 'terminal', 'y2k', 'blueprint', 'glitch', 'dark-ui',
  'neo-brutalism', 'brutalism', 'editorial', 'illustration', 'chalkboard', 'holographic', 'bauhaus',
  'japanese', 'modern-japanese', 'nordic', 'organic', 'luxury', 'pop', 'kawaii', 'steampunk'
];

// 各テーマのCSSを行ごとに格納するバッファ
const themeBuffers = {};
themeIds.forEach(id => {
  themeBuffers[id] = [];
});

let currentTheme = null;

// テーマ固有ルールを解析して振り分ける
for (let i = 0; i < themeCssLines.length; i++) {
  const line = themeCssLines[i];
  
  // コメントからテーマIDの切り替えを検出
  // 例: /* ── Minimal / Clean ── */
  if (line.includes('──')) {
    const match = themeIds.find(id => {
      // 大文字小文字や別名に対応するため、コメント内の英語表記とテーマIDをゆるくマッチング
      const normalizedId = id.replace('-', '');
      const normalizedLine = line.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedLine.includes(normalizedId);
    });
    
    if (match) {
      currentTheme = match;
    }
  }
  
  // セレクタのプレフィックスからテーマIDを検出（上書き用）
  // 例: [data-theme='retro'] または html[data-theme='retro']
  const dataThemeRegex = /\[data-theme=['"]([^'"]+)['"]\]/;
  const themeMatch = line.match(dataThemeRegex);
  if (themeMatch) {
    const id = themeMatch[1];
    if (themeIds.includes(id)) {
      currentTheme = id;
    }
  }

  // 振り分け
  if (currentTheme) {
    themeBuffers[currentTheme].push(line);
  } else {
    // どのテーマにも属さないヘッダーやコメント等はベースまたは最初のテーマ (neo-brutalism) に割り当て
    themeBuffers['neo-brutalism'].push(line);
  }
}

// ファイル書き出し
themeIds.forEach(id => {
  const themeCss = themeBuffers[id].join('\n').trim();
  if (themeCss) {
    const destFile = path.join(destDir, `theme-${id}.css`);
    fs.writeFileSync(destFile, themeCss);
    console.log(`Saved theme CSS: theme-${id}.css (${themeCss.length} bytes)`);
  }
});

// 新しい app/globals.css を書き出し
fs.writeFileSync(globalsCssPath, baseCss.trim() + '\n');
console.log(`Updated app/globals.css (${baseCss.length} bytes)`);
