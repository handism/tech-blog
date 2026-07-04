// src/lib/og-helpers.ts
/**
 * OGP 画像生成ルート（app/og/[slug]/ と app/og/aws/[slug]/）で共有する
 * フォント・アバター読み込みユーティリティ。
 * ビルド時にキャッシュし、同一プロセス内での重複 I/O を防ぐ。
 */
import { siteConfig } from '@/src/config/site';
import { promises as fsPromises } from 'fs';
import path from 'path';

let fontDataCache: Promise<ArrayBuffer> | null = null;
let avatarDataCache: Promise<string> | null = null;

/**
 * OGP 用フォント（NotoSansCJKjp-Bold.otf）を読み込み、ArrayBuffer を返す。
 * 同一プロセス内ではキャッシュを返す。
 */
export async function getOgFontData(): Promise<ArrayBuffer> {
  if (!fontDataCache) {
    fontDataCache = (async () => {
      const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansCJKjp-Bold.otf');
      try {
        const buffer = await fsPromises.readFile(fontPath);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      } catch (e) {
        console.error('Failed to load font. Did you run `npm run dev` or download scripts?', e);
        throw e;
      }
    })();
  }
  return fontDataCache;
}

/**
 * OGP 用アバター画像の Data URI（base64 PNG）を返す。
 * ローカルファイルが存在しない場合は GitHub アバター URL にフォールバックする。
 * 同一プロセス内ではキャッシュを返す。
 */
export async function getOgAvatarDataUri(): Promise<string> {
  if (!avatarDataCache) {
    avatarDataCache = (async () => {
      const avatarPath = path.join(process.cwd(), 'public', 'images', 'avatar.png');
      try {
        const buffer = await fsPromises.readFile(avatarPath);
        return `data:image/png;base64,${buffer.toString('base64')}`;
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.error('Failed to load local avatar image:', e);
        }
        return `${siteConfig.github}.png`;
      }
    })();
  }
  return avatarDataCache;
}
