'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Image as ImageIcon, Upload, Download, RefreshCw, Trash2 } from 'lucide-react';

type ImageState = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
};

type OptimizedState = {
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
};

export default function ImageOptimizer() {
  const [image, setImage] = useState<ImageState | null>(null);
  const [optimized, setOptimized] = useState<OptimizedState | null>(null);
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | ''>('');
  const [maxHeight, setMaxHeight] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル読み込み処理
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      setImage({
        file,
        previewUrl,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
      });
      // デフォルトで最大幅を元画像に合わせるか、空欄にしておく
      setOptimized(null);
    };
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    if (image) URL.revokeObjectURL(image.previewUrl);
    if (optimized) URL.revokeObjectURL(optimized.previewUrl);
    setImage(null);
    setOptimized(null);
    setMaxWidth('');
    setMaxHeight('');
  };

  // 画像の最適化/変換処理
  const runOptimize = useCallback(async () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = image.previewUrl;

    img.onload = () => {
      // リサイズ計算
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (maxWidth && targetWidth > maxWidth) {
        const ratio = maxWidth / targetWidth;
        targetWidth = maxWidth;
        targetHeight = Math.round(targetHeight * ratio);
      }

      if (maxHeight && targetHeight > maxHeight) {
        const ratio = maxHeight / targetHeight;
        targetHeight = maxHeight;
        targetWidth = Math.round(targetWidth * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // 背景色設定 (JPEGの場合は透明部分を白く塗りつぶす)
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Blobにエクスポート
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const previewUrl = URL.createObjectURL(blob);
            setOptimized((prev) => {
              if (prev) {
                URL.revokeObjectURL(prev.previewUrl);
              }
              return {
                blob,
                previewUrl,
                width: targetWidth,
                height: targetHeight,
                size: blob.size,
              };
            });
          }
          setIsProcessing(false);
        },
        format,
        format === 'image/png' ? undefined : quality / 100
      );
    };
  }, [image, format, quality, maxWidth, maxHeight]);

  // 設定変更時に自動で再処理
  useEffect(() => {
    if (image) {
      const timer = setTimeout(() => {
        runOptimize();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [image, runOptimize]);

  // ファイルサイズ変換ヘルパー
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!optimized || !image) return;
    const ext = format === 'image/webp' ? 'webp' : format === 'image/jpeg' ? 'jpg' : 'png';
    const originalName =
      image.file.name.substring(0, image.file.name.lastIndexOf('.')) || image.file.name;
    const a = document.createElement('a');
    a.download = `${originalName}-opt.${ext}`;
    a.href = optimized.previewUrl;
    a.click();
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：設定 ＆ アップロード */}
        <div className="lg:col-span-5 space-y-6">
          {/* アップローダー */}
          {!image ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`
                theme-card p-10 bg-card hover:bg-secondary cursor-pointer border-dashed border-3 flex flex-col items-center justify-center text-center transition-colors
                ${dragActive ? 'bg-accent/10 border-accent' : 'border-border'}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <Upload className="w-12 h-12 text-text/40 mb-4 animate-bounce" />
              <h3 className="font-extrabold text-base mb-1">画像をドラッグ＆ドロップ</h3>
              <p className="text-xs text-text/60 font-medium">またはクリックしてファイルを選択</p>
            </div>
          ) : (
            /* 画像情報 ＆ 設定パネル */
            <div className="theme-card p-6 space-y-5">
              <div className="flex justify-between items-center border-b-2 border-border pb-3">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>⚙️</span> 最適化設定
                </h3>
                <button
                  onClick={clearImage}
                  className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  画像をクリア
                </button>
              </div>

              {/* フォーマット選択 */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold block">出力フォーマット</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'image/webp', label: 'WebP' },
                      { id: 'image/jpeg', label: 'JPEG' },
                      { id: 'image/png', label: 'PNG' },
                    ] as const
                  ).map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id)}
                      className={`
                        py-2 text-xs font-bold rounded-lg border-2 border-border transition-all cursor-pointer
                        ${
                          format === fmt.id
                            ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                            : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)]'
                        }
                      `}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 品質調整 (PNG以外) */}
              {format !== 'image/png' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-extrabold">
                    <span>品質 (画質): {quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-accent bg-secondary rounded-lg h-2 cursor-pointer"
                  />
                </div>
              )}

              {/* リサイズ設定 */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold block">リサイズ（空欄でサイズ維持）</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text/60">最大幅 (px)</span>
                    <input
                      type="number"
                      placeholder="幅を指定"
                      value={maxWidth}
                      onChange={(e) =>
                        setMaxWidth(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text/60">最大高さ (px)</span>
                    <input
                      type="number"
                      placeholder="高さを指定"
                      value={maxHeight}
                      onChange={(e) =>
                        setMaxHeight(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 右側：プレビュー ＆ 比較結果 */}
        <div className="lg:col-span-7 space-y-6">
          {image ? (
            <div className="space-y-6">
              {/* 元画像 vs 最適化後 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 元画像カード */}
                <div className="theme-card p-4 space-y-3 bg-card">
                  <span className="text-[10px] bg-secondary text-text font-black px-2 py-0.5 rounded border border-border">
                    Original
                  </span>
                  <div className="aspect-video bg-[#eaeaea] dark:bg-[#222222] rounded-lg overflow-hidden border border-border flex items-center justify-center relative">
                    <img
                      src={image.previewUrl}
                      alt="Original Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-bold space-y-1 text-text/70">
                    <div className="truncate" title={image.file.name}>
                      {image.file.name}
                    </div>
                    <div>
                      解像度: {image.width} × {image.height} px
                    </div>
                    <div>ファイルサイズ: {formatBytes(image.size)}</div>
                  </div>
                </div>

                {/* 最適化後カード */}
                <div className="theme-card p-4 space-y-3 bg-card border-accent shadow-[5px_5px_0px_0px_var(--color-accent)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] bg-accent text-white font-black px-2 py-0.5 rounded">
                      Optimized
                    </span>
                    {isProcessing && (
                      <span className="text-xs font-bold text-accent animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        処理中...
                      </span>
                    )}
                  </div>
                  <div className="aspect-video bg-[#eaeaea] dark:bg-[#222222] rounded-lg overflow-hidden border border-border flex items-center justify-center relative">
                    {optimized ? (
                      <img
                        src={optimized.previewUrl}
                        alt="Optimized Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-xs font-bold text-text/40">プレビュー準備中...</div>
                    )}
                  </div>
                  <div className="text-xs font-bold space-y-1 text-text/70">
                    {optimized ? (
                      <>
                        <div>
                          解像度: {optimized.width} × {optimized.height} px
                        </div>
                        <div className="flex items-center gap-2">
                          <span>ファイルサイズ: {formatBytes(optimized.size)}</span>
                          {image.size > optimized.size ? (
                            <span className="text-emerald-500 font-extrabold text-[10px] bg-emerald-100 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300">
                              -{((1 - optimized.size / image.size) * 100).toFixed(1)}%
                            </span>
                          ) : image.size < optimized.size ? (
                            <span className="text-amber-500 font-extrabold text-[10px] bg-amber-100 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-300">
                              +{((optimized.size / image.size - 1) * 100).toFixed(1)}%
                            </span>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="text-text/40">設定値に基づき自動で再構築されます</div>
                    )}
                  </div>
                </div>
              </div>

              {/* ダウンロードエリア */}
              {optimized && (
                <div className="theme-card p-6 bg-secondary flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black bg-accent text-white px-2.5 py-1 rounded-lg">
                      準備完了
                    </span>
                    <p className="text-xs font-bold text-text/80">
                      画像の最適化が完了しました。ローカルに保存できます。
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full md:w-auto theme-btn bg-accent text-white px-6 py-3 text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>最適化された画像を保存</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 画像未選択時のダミープレビュー表示 */
            <div className="theme-card p-8 bg-secondary/30 border-dashed border-2 border-border/30 h-full flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">🖼️</span>
              <h4 className="font-extrabold text-sm text-text/40 mb-1">プレビューエリア</h4>
              <p className="text-xs text-text/30 font-medium max-w-xs">
                画像をアップロードすると、ここに元画像と圧縮後の画像が表示され、ファイルサイズを比較できます。
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
