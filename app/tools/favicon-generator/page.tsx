'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useRef } from 'react';
import { Upload, Download, Check, Clipboard } from 'lucide-react';
import JSZip from 'jszip';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface IconSize {
  name: string;
  filename: string;
  width: number;
  height: number;
  desc: string;
}

const ICON_SIZES: IconSize[] = [
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

export default function FaviconGeneratorPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [generatedIcons, setGeneratedIcons] = useState<Record<string, string>>({}); // filename -> dataUrl
  const { copied, copy } = useCopyToClipboard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSourceImage(event.target.result as string);
        generateAllIcons(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const generateAllIcons = (imgSrc: string) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const results: Record<string, string> = {};

      ICON_SIZES.forEach((size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          // 背景は透過
          ctx.clearRect(0, 0, size.width, size.height);

          // 画像アスペクト比を保ったまま中央に描画
          const srcRatio = img.width / img.height;
          const destRatio = size.width / size.height;
          let drawWidth = size.width;
          let drawHeight = size.height;
          let offsetX = 0;
          let offsetY = 0;

          if (srcRatio > destRatio) {
            drawHeight = size.width / srcRatio;
            offsetY = (size.height - drawHeight) / 2;
          } else {
            drawWidth = size.height * srcRatio;
            offsetX = (size.width - drawWidth) / 2;
          }

          // 高品質スケーリングの有効化
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          results[size.filename] = canvas.toDataURL('image/png');
        }
      });

      setGeneratedIcons(results);
    };
  };

  const downloadSingleIcon = (filename: string, dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const downloadAllAsZip = async () => {
    if (Object.keys(generatedIcons).length === 0) return;

    const zip = new JSZip();
    Object.entries(generatedIcons).forEach(([filename, dataUrl]) => {
      // "data:image/png;base64,xxxx" の部分を除去してbase64バイナリとして登録
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      zip.file(filename, base64Data, { base64: true });
    });

    // PWA用のmanifest.jsonも同梱する親切設計
    const manifestJson = {
      name: 'My App',
      short_name: 'App',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    };
    zip.file('site.webmanifest', JSON.stringify(manifestJson, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    const blobUrl = URL.createObjectURL(content);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'favicons_and_manifest.zip';
    a.click();

    URL.revokeObjectURL(blobUrl);
  };

  const htmlCode = `<!-- Webブラウザ用ファビコン設定 -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  const copyHtmlCode = () => {
    copy(htmlCode);
  };

  return (
    <ToolPageLayout
      title="Favicon & App Icon Generator"
      description="1枚のオリジナル画像から、主要なすべてのファビコンサイズを一括生成し、PWA用マニフェストと共にZIPでまとめてダウンロードできます。"
      icon={Upload}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: 画像アップロード & プレビュー */}
        <div className="lg:col-span-5 space-y-6">
          <div className="theme-card p-5 md:p-6 space-y-5">
            <h2 className="text-lg font-bold text-text border-b-2 border-border pb-2">
              📤 画像のアップロード
            </h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-3 border-dashed border-border/40 hover:border-accent/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-card/50 text-center"
            >
              <Upload className="w-10 h-10 text-text/50 mb-3" />
              <span className="text-sm font-extrabold text-text">
                {imageName ? imageName : '画像ファイルをドロップまたはクリック'}
              </span>
              <span className="text-xs font-medium text-text/60 mt-1.5">
                PNG, JPG, SVGに対応 (正方形画像がベスト)
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {sourceImage && (
              <div className="space-y-3">
                <span className="text-sm font-bold text-text block">元の画像プレビュー</span>
                <div className="flex justify-center border-2 border-border bg-secondary/30 rounded-xl p-4">
                  <img
                    src={sourceImage}
                    alt="Source Preview"
                    className="max-h-[160px] max-w-full rounded-lg object-contain shadow-sm border border-border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* HTML記述コード */}
          {Object.keys(generatedIcons).length > 0 && (
            <div className="theme-card p-5 md:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-text">📋 HTML &lt;head&gt; の設定</h3>
                <button
                  onClick={copyHtmlCode}
                  className="theme-btn p-1.5 bg-secondary text-text"
                  title="コードをコピー"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="p-3 border-2 border-border rounded-xl font-mono text-[11px] bg-slate-950 text-slate-100 overflow-x-auto whitespace-pre">
                {htmlCode}
              </pre>
            </div>
          )}
        </div>

        {/* 右カラム: 生成結果一覧 */}
        <div className="lg:col-span-7">
          <div className="theme-card p-5 md:p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b-2 border-border pb-3">
              <h2 className="text-lg font-bold text-text">✨ 生成結果プレビュー</h2>
              {Object.keys(generatedIcons).length > 0 && (
                <button
                  onClick={downloadAllAsZip}
                  className="theme-btn px-4 py-2 bg-accent text-white font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  ZIPで一括保存
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {Object.keys(generatedIcons).length > 0 ? (
                ICON_SIZES.map((size) => {
                  const dataUrl = generatedIcons[size.filename];
                  if (!dataUrl) return null;
                  return (
                    <div
                      key={size.filename}
                      className="flex items-center justify-between p-3 border-2 border-border rounded-xl bg-card hover:bg-secondary/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* アイコンプレビュー */}
                        <div className="flex items-center justify-center w-16 h-16 border border-border/40 bg-secondary/30 rounded-lg shrink-0 overflow-hidden">
                          <img
                            src={dataUrl}
                            alt={size.name}
                            style={{ width: `${size.width}px`, height: `${size.height}px` }}
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-extrabold text-text truncate">
                            {size.name} ({size.width}x{size.height})
                          </h3>
                          <p className="text-xs font-semibold text-text/60 truncate">
                            {size.filename}
                          </p>
                          <p className="text-[10px] text-text/50 font-medium truncate mt-0.5">
                            {size.desc}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadSingleIcon(size.filename, dataUrl)}
                        className="theme-btn p-2 bg-secondary text-text shrink-0"
                        title="個別ダウンロード"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text/40 font-bold p-8 text-center text-sm py-20">
                  <Upload className="w-12 h-12 mb-3 opacity-30 animate-pulse" />
                  左側で画像をアップロードすると、ここにサイズごとのファビコン生成プレビューが表示されます。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
