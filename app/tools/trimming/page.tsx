'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { siteConfig } from '@/src/config/site';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Download, Maximize, Crop, FileImage } from 'lucide-react';

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  format: 'png' | 'webp'
): Promise<string> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2d context');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // ★ここが重要：Safari対策で100〜500ms待つ
  await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms前後が安定しやすい

  return canvas.toDataURL(`image/${format}`);
};

export default function ImageTrimmingApp() {
  useEffect(() => {
    document.title = `Image Trimmer | ${siteConfig.name}`;
  }, []);

  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [format, setFormat] = useState<'png' | 'webp'>('png');
  const [isDragging, setIsDragging] = useState(false);

  // ファイル処理の共通ロジック
  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // フォルダから選択
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // ドラッグ&ドロップのハンドラー
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const downloadResult = async () => {
    if (!image || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, format);

      // ─────────────── 修正版 ───────────────
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // iOSの場合：新しいタブで開いて長押し保存を促す
        const newWindow = window.open('');
        if (newWindow) {
          newWindow.document.write(`
          <html>
            <head><title>画像を保存</title></head>
            <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#000;">
              <img src="${croppedImage}" style="max-width:95%;max-height:95%;object-fit:contain;" />
              <p style="position:absolute;top:16px;color:white;font-family:sans-serif;">
                画像を長押し →「画像を保存」をタップしてください
              </p>
            </body>
          </html>
        `);
        } else {
          alert('ポップアップがブロックされています。\n設定でポップアップを許可してください。');
        }
      } else {
        // Android / PC は従来の方法でOK（ただし最近Androidも怪しい）
        const link = document.createElement('a');
        link.download = `trimmed-image.${format}`;
        link.href = croppedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
      alert('画像の作成に失敗しました');
    }
  };

  return (
    <div className="flex flex-col items-center p-5 min-h-screen max-w-6xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3 tracking-tight">
          <Crop className="w-10 h-10 text-accent" />
          Image Trimmer
        </h1>
        <p className="mt-2 font-medium">ドラッグ＆ドロップで素早くトリミング</p>
      </header>

      <main className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-200">
        {image ? (
          <div className="flex flex-col lg:flex-row">
            {/* トリミングエリア */}
            <div className="relative w-full h-125 lg:w-3/4 bg-slate-900">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* コントロールパネル */}
            <div className="p-8 w-full lg:w-1/4 flex flex-col gap-8 border-l border-slate-100 bg-white">
              <section>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Maximize className="w-4 h-4" /> Aspect Ratio
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: '16 : 9 (Wide)', val: 16 / 9 },
                    { label: '4 : 3 (Standard)', val: 4 / 3 },
                    { label: '1 : 1 (Square)', val: 1 / 1 },
                  ].map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspect(ratio.val)}
                      className={`py-3 px-4 text-sm font-semibold rounded-xl border-2 transition-all ${
                        aspect === ratio.val
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                          : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                  Zoom
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </section>

              <section>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                  Format
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['png', 'webp'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f as 'png' | 'webp')}
                      className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                        format === f
                          ? 'bg-white shadow-sm text-indigo-600'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </section>

              <div className="mt-auto pt-6 flex flex-col gap-3">
                <button
                  onClick={downloadResult}
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200"
                >
                  <Download className="w-5 h-5" /> Download
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="py-2 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear and Restart
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* アップロードエリア（D&D対応） */
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`group m-8 h-80 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
              id="upload-input"
            />
            <label htmlFor="upload-input" className="flex flex-col items-center cursor-pointer">
              <div
                className={`p-5 rounded-full mb-4 transition-all ${
                  isDragging
                    ? 'bg-indigo-500 text-white animate-bounce'
                    : 'bg-white text-slate-400 shadow-sm group-hover:text-indigo-500'
                }`}
              >
                <FileImage className="w-12 h-12" />
              </div>
              <span className="text-xl font-bold text-slate-700">
                {isDragging ? 'そのままドロップ！' : '画像をドロップして開始'}
              </span>
              <span className="text-slate-400 mt-2 font-medium border-b border-slate-200 pb-1 hover:text-indigo-500 transition-colors">
                またはフォルダから選択
              </span>
            </label>
          </div>
        )}
      </main>
    </div>
  );
}
