export interface IconSize {
  name: string;
  filename: string;
  width: number;
  height: number;
  desc: string;
}

export const ICON_SIZES: IconSize[] = [
  {
    name: 'Favicon (Small)',
    filename: 'favicon-16x16.png',
    width: 16,
    height: 16,
    desc: 'ブラウザのタブ用',
  },
  {
    name: 'Favicon (Medium)',
    filename: 'favicon-32x32.png',
    width: 32,
    height: 32,
    desc: 'ブックマークバーやデスクトップ用',
  },
  {
    name: 'Favicon (Legacy)',
    filename: 'favicon-48x48.png',
    width: 48,
    height: 48,
    desc: '一部のWindows環境用',
  },
  {
    name: 'Apple Touch Icon',
    filename: 'apple-touch-icon.png',
    width: 180,
    height: 180,
    desc: 'iOSのホーム画面に追加した時用',
  },
  {
    name: 'Android Chrome (Small)',
    filename: 'android-chrome-192x192.png',
    width: 192,
    height: 192,
    desc: 'Androidホーム画面・PWA用',
  },
  {
    name: 'Android Chrome (Large)',
    filename: 'android-chrome-512x512.png',
    width: 512,
    height: 512,
    desc: 'スプラッシュ画面・PWA用',
  },
];
