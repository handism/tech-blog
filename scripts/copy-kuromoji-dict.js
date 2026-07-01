// scripts/copy-kuromoji-dict.js
// kuromoji の辞書ファイルを public/kuromoji/dict/ にコピーする。
// ビルド・開発サーバー起動前に実行し、ブラウザから辞書を取得できるようにする。

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules/kuromoji/dict');
const dest = path.join(__dirname, '../public/kuromoji/dict');

fs.mkdirSync(dest, { recursive: true });

const srcFiles = fs.readdirSync(src);
let allExist = true;

for (const file of srcFiles) {
  const destFilePath = path.join(dest, file);
  const srcFilePath = path.join(src, file);
  
  if (!fs.existsSync(destFilePath)) {
    allExist = false;
    break;
  }
  
  // サイズが一致するかチェック
  const srcStat = fs.statSync(srcFilePath);
  const destStat = fs.statSync(destFilePath);
  if (srcStat.size !== destStat.size) {
    allExist = false;
    break;
  }
}

if (allExist) {
  console.log('kuromoji dict files already up-to-date. Skipping copy.');
} else {
  for (const file of srcFiles) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }
  console.log('kuromoji dict files copied to public/kuromoji/dict/');
}
