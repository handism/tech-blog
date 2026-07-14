// scripts/copy-pattern-assets.js
const fs = require('fs');
const path = require('path');

/**
 * AWS Patterns のアセット（IaC テンプレート YAML・drawio SVG 画像）を
 * public/patterns/ 配下へ同期するビルド前処理スクリプト。
 *
 * 以前は src/lib/aws-gallery-repository.ts の読み込み関数が副作用としてコピーしていたが、
 * 「読み取り」層からファイル書き込みを分離するため、scripts/download-fonts.js と同様の
 * prebuild スクリプトへ切り出した。dev / build の実行前に呼び出される。
 */

const awsDir = path.join(process.cwd(), 'patterns');
const metaPath = path.join(awsDir, 'gallery-meta.json');
const iacDir = path.join(awsDir, 'iac');
const imgDir = path.join(awsDir, 'img');
const publicDestDir = path.join(process.cwd(), 'public', 'patterns');

/**
 * 更新日時を比較し、コピーが必要な場合のみファイルをコピーする。
 */
function copyIfNewer(srcFile, destName) {
  if (!fs.existsSync(srcFile)) {
    console.warn(`Pattern asset not found, skipped: ${srcFile}`);
    return;
  }
  fs.mkdirSync(publicDestDir, { recursive: true });
  const destFile = path.join(publicDestDir, destName);

  if (fs.existsSync(destFile)) {
    try {
      const srcStat = fs.statSync(srcFile);
      const destStat = fs.statSync(destFile);
      // コピー先の方が新しい（または同時刻）ならスキップ
      if (srcStat.mtimeMs <= destStat.mtimeMs) {
        return;
      }
    } catch {
      // stat 取得に失敗した場合は念のためコピーする
    }
  }

  fs.copyFileSync(srcFile, destFile);
  console.log(`Copied pattern asset: ${destName}`);
}

function main() {
  if (!fs.existsSync(metaPath)) {
    console.log('No gallery-meta.json found, skipping pattern asset copy.');
    return;
  }

  let metas;
  try {
    metas = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch (error) {
    console.error('Failed to parse gallery-meta.json:', error.message || error);
    process.exit(1);
  }

  if (!Array.isArray(metas)) {
    console.error('gallery-meta.json is expected to be an array.');
    process.exit(1);
  }

  for (const meta of metas) {
    if (meta && typeof meta.templateFile === 'string') {
      copyIfNewer(path.join(iacDir, meta.templateFile), meta.templateFile);
    }
    if (meta && typeof meta.diagramFile === 'string') {
      copyIfNewer(path.join(imgDir, meta.diagramFile), meta.diagramFile);
    }
  }
}

main();
