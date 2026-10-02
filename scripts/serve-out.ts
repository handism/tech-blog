// scripts/serve-out.ts
/**
 * ビルド成果物（out/）を GitHub Pages と同じく basePath 配下で配信するローカルサーバー。
 * `serve out` ではルート直下に配信されてしまい、basePath 付きのリンク・アセットが解決できないため。
 *
 * 使い方: bun run scripts/serve-out.ts [port]
 */
import fs from 'fs/promises';
import http from 'http';
import path from 'path';
import { siteConfig } from '../src/config/site';

const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);
const outDir = path.join(process.cwd(), 'out');
const { basePath } = siteConfig;

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.yaml': 'text/yaml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** out/ 配下の実ファイルを解決する。ディレクトリなら index.html を返す。 */
async function resolveFile(pathname: string): Promise<string | null> {
  const filePath = path.join(outDir, decodeURIComponent(pathname));
  if (filePath !== outDir && !filePath.startsWith(`${outDir}${path.sep}`)) return null; // パストラバーサル対策

  for (const candidate of [filePath, path.join(filePath, 'index.html')]) {
    const stat = await fs.stat(candidate).catch(() => null);
    if (stat?.isFile()) return candidate;
  }
  return null;
}

async function sendFile(res: http.ServerResponse, filePath: string, status = 200) {
  const contentType = CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(await fs.readFile(filePath));
}

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');

    if (basePath && (pathname === '/' || pathname === basePath)) {
      res.writeHead(302, { Location: `${basePath}/` }).end();
      return;
    }
    if (basePath && !pathname.startsWith(`${basePath}/`)) {
      res.writeHead(404).end('Not Found');
      return;
    }

    const filePath = await resolveFile(pathname.slice(basePath.length));
    if (filePath) {
      await sendFile(res, filePath);
      return;
    }
    await sendFile(res, path.join(outDir, '404.html'), 404);
  })
  .listen(port, () => {
    console.log(`Serving out/ at http://localhost:${port}${basePath}/`);
  });
