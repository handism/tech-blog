// src/lib/og-helpers.ts
/**
 * OGP 画像生成ルート（app/og/[slug]/ と app/og/aws/[slug]/）で共有する
 * フォント・アバター読み込みユーティリティ。
 * ビルド時にキャッシュし、同一プロセス内での重複 I/O を防ぐ。
 */
import { siteConfig } from '@/src/config/site';
import fs from 'fs';
import path from 'path';

let fontDataCache: ArrayBuffer | null = null;
let avatarDataCache: string | null = null;

/**
 * OGP 用フォント（NotoSansCJKjp-Bold.otf）を読み込み、ArrayBuffer を返す。
 * 同一プロセス内ではキャッシュを返す。
 */
export function getOgFontData(): ArrayBuffer {
  if (!fontDataCache) {
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansCJKjp-Bold.otf');
    try {
      const buffer = fs.readFileSync(fontPath);
      fontDataCache = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    } catch (e) {
      console.error('Failed to load font. Did you run `npm run dev` or download scripts?', e);
      throw e;
    }
  }
  return fontDataCache;
}

/**
 * OGP 用アバター画像の Data URI（base64 PNG）を返す。
 * ローカルファイルが存在しない場合は GitHub アバター URL にフォールバックする。
 * 同一プロセス内ではキャッシュを返す。
 */
export function getOgAvatarDataUri(): string {
  if (!avatarDataCache) {
    const avatarPath = path.join(process.cwd(), 'public', 'images', 'avatar.png');
    try {
      if (fs.existsSync(avatarPath)) {
        const buffer = fs.readFileSync(avatarPath);
        avatarDataCache = `data:image/png;base64,${buffer.toString('base64')}`;
      } else {
        avatarDataCache = `${siteConfig.github}.png`;
      }
    } catch (e) {
      console.error('Failed to load local avatar image:', e);
      avatarDataCache = `${siteConfig.github}.png`;
    }
  }
  return avatarDataCache;
}
