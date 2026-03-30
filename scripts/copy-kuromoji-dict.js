// scripts/copy-kuromoji-dict.js
// kuromoji の辞書ファイルを public/kuromoji/dict/ にコピーする。
// ビルド・開発サーバー起動前に実行し、ブラウザから辞書を取得できるようにする。

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../node_modules/kuromoji/dict');
const dest = path.join(__dirname, '../public/kuromoji/dict');

fs.mkdirSync(dest, { recursive: true });
for (const file of fs.readdirSync(src)) {
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
console.log('kuromoji dict files copied to public/kuromoji/dict/');
