// scripts/download-fonts.js
const fs = require('fs');
const path = require('path');

async function downloadFont() {
  const destDir = path.join(process.cwd(), 'public', 'fonts');
  const dest = path.join(destDir, 'NotoSansCJKjp-Bold.otf');

  // 既にダウンロード済みの場合はスキップ
  if (fs.existsSync(dest)) {
    console.log('Font already downloaded.');
    return;
  }

  // Noto Sans CJK JP Bold (OTF) を GitHub からダウンロード
  const fontUrl =
    'https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf';
  
  console.log(`Downloading font from ${fontUrl}... (It may take a while as the file is large)`);

  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();

    // ディレクトリが存在しない場合は作成
    fs.mkdirSync(destDir, { recursive: true });
    
    // 取得したフォントデータをファイルに書き込む
    fs.writeFileSync(dest, Buffer.from(buffer));
    console.log('Successfully downloaded NotoSansCJKjp-Bold.otf');
  } catch (error) {
    console.error('Error downloading font:', error);
    process.exit(1);
  }
}

downloadFont();
