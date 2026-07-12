'use client';

import { useState } from 'react';
import { Copy, Check, Download, RotateCw, Plus, Minus } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface SizePreset {
  label: string;
  width: number;
  height: number;
  fontSize?: number;
}

export default function PlaceholderGenerator() {
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(450);
  const [bgColor, setBgColor] = useState<string>('#cccccc');
  const [textColor, setTextColor] = useState<string>('#666666');
  const [customText, setCustomText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(48);
  const [fontFamily, setFontFamily] = useState<string>('Lexend');
  const { copied, copy } = useCopyToClipboard();
  const [copiedType, setCopiedType] = useState<string>('');

  const sizePresets: SizePreset[] = [
    { label: '16:9 カバー画像', width: 1200, height: 675, fontSize: 80 },
    { label: 'OGP画像 (1200x630)', width: 1200, height: 630, fontSize: 80 },
    { label: '4:3 標準画面', width: 800, height: 600, fontSize: 48 },
    { label: '1:1 スクエア (大)', width: 800, height: 800, fontSize: 48 },
    { label: '1:1 スクエア (中)', width: 400, height: 400, fontSize: 32 },
    { label: 'モバイルバナー (640x360)', width: 640, height: 360, fontSize: 28 },
    { label: 'FHDバナー (1920x1080)', width: 1920, height: 1080, fontSize: 120 },
    { label: 'アイコンプレース (128x128)', width: 128, height: 128, fontSize: 14 },
  ];

  // SVG コードの生成
  const generateSvgString = () => {
    const displayText = customText || `${width} × ${height}`;
    const escapedText = displayText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // フォントファミリーマッピング (Lexend, Space Grotesk などを優先)
    const fontMapping: { [key: string]: string } = {
      Lexend: 'Lexend, sans-serif',
      'Space Grotesk': '"Space Grotesk", sans-serif',
      Caveat: 'Caveat, cursive',
      Monospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      Serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      Sans: 'ui-sans-serif, system-ui, sans-serif',
    };

    const fontStyle = fontMapping[fontFamily] || 'sans-serif';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="${fontStyle}" font-size="${fontSize}px" font-weight="bold" fill="${textColor}">${escapedText}</text>
</svg>`;
  };

  const svgContent = generateSvgString();

  // Data URI の生成 (Base64)
  const generateDataUri = () => {
    try {
      const base64 = btoa(unescape(encodeURIComponent(svgContent)));
      return `data:image/svg+xml;base64,${base64}`;
    } catch {
      return '';
    }
  };

  const dataUri = generateDataUri();

  // コピーハンドラ
  const handleCopy = (text: string, type: string) => {
    copy(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType('');
    }, 2000);
  };

  // SVG ダウンロード
  const downloadSvg = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placeholder-${width}x${height}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Canvas 経由の PNG ダウンロード
  const downloadPng = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `placeholder-${width}x${height}.png`;
        link.href = pngUrl;
        link.click();
      }
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // アスペクト比プレビュー用の縮小率計算 (プレビューコンテナに収まるように)
  const maxPreviewSize = 320;
  const previewRatio = Math.min(maxPreviewSize / width, maxPreviewSize / height, 1);
  const previewWidth = width * previewRatio;
  const previewHeight = height * previewRatio;

  // テキスト色と背景色の反転機能
  const invertColors = () => {
    const temp = bgColor;
    setBgColor(textColor);
    setTextColor(temp);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側：プレビュー＆コード (7列) */}
        <div className="lg:col-span-7 space-y-6">
          {/* プレビューコンテナ */}
          <div className="border-3 border-border rounded-3xl p-6 bg-secondary/20 shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] flex flex-col items-center justify-center min-h-[360px] relative">
            <span className="absolute top-4 left-4 text-[9px] bg-black/40 text-white font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              ライブプレビュー
            </span>

            {/* 比率を保ったプレビュー画像 */}
            <div
              style={{
                width: `${previewWidth}px`,
                height: `${previewHeight}px`,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
              className="relative transition-all duration-300 rounded-xl overflow-hidden shrink-0 select-none bg-white [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />

            <div className="mt-6 text-center text-xs font-bold text-text/50">
              実際の画像出力サイズ: {width} × {height} px (アスペクト比{' '}
              {Math.round((width / height) * 100) / 100}:1)
            </div>
          </div>

          {/* クイックアクションボタン */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={downloadSvg}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-border bg-card hover:bg-secondary text-text font-black text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>SVGファイル保存</span>
            </button>
            <button
              onClick={downloadPng}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 border-border bg-card hover:bg-secondary text-text font-black text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PNG画像書き出し</span>
            </button>
          </div>

          {/* 出力コード表示 */}
          <div className="theme-card bg-secondary border-2 border-border rounded-2xl p-5 space-y-4">
            {/* Data URI */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-text/50 tracking-wider">
                  DATA URI (BASE64)
                </span>
                <button
                  onClick={() => handleCopy(dataUri, 'uri')}
                  className="theme-btn p-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copied && copiedType === 'uri' ? (
                    <>
                      <Check className="w-3 h-3 text-accent" />
                      <span className="text-accent font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Data URI コピー</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                readOnly
                value={dataUri}
                className="theme-textarea w-full font-mono text-[10px] h-16 resize-none select-all"
              />
            </div>

            {/* HTML Tag */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-text/50 tracking-wider">
                  HTML &lt;IMG&gt; TAG
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `<img src="${dataUri}" width="${width}" height="${height}" alt="placeholder" />`,
                      'html'
                    )
                  }
                  className="theme-btn p-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  {copied && copiedType === 'html' ? (
                    <>
                      <Check className="w-3 h-3 text-accent" />
                      <span className="text-accent font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>HTMLコピー</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="theme-card bg-secondary font-mono text-[10px] p-3 rounded-xl border-2 border-border overflow-x-auto select-all text-text/80">
                {`<img src="${dataUri.slice(0, 45)}..." width="${width}" height="${height}" alt="placeholder" />`}
              </pre>
            </div>
          </div>
        </div>

        {/* 右側：コントロールパネル (5列) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] space-y-6">
            <h3 className="font-black text-sm border-b-2 border-border pb-3 text-text">
              画像設定パラメータ
            </h3>

            {/* サイズ変更 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">幅 (Width)</label>
                  <input
                    type="number"
                    min="16"
                    max="4000"
                    value={width}
                    onChange={(e) => setWidth(Math.max(16, Number(e.target.value)))}
                    className="theme-input w-full font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">
                    高さ (Height)
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="4000"
                    value={height}
                    onChange={(e) => setHeight(Math.max(16, Number(e.target.value)))}
                    className="theme-input w-full font-mono text-xs"
                  />
                </div>
              </div>

              {/* サイズプリセット */}
              <div>
                <label className="block text-xs font-bold text-text/60 mb-2">
                  プリセットサイズから選択
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sizePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setWidth(preset.width);
                        setHeight(preset.height);
                        if (preset.fontSize) {
                          setFontSize(preset.fontSize);
                        }
                      }}
                      className="p-2 border border-border bg-card hover:bg-secondary text-text/80 rounded-xl text-[10px] font-bold text-left transition-colors cursor-pointer truncate"
                      title={`${preset.label}: ${preset.width}x${preset.height}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* カラー調整 */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">背景カラー</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="theme-input w-full px-2 py-1 text-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">文字カラー</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-border cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="theme-input w-full px-2 py-1 text-xs font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* 配色反転 */}
              <button
                onClick={invertColors}
                className="w-full py-2 bg-secondary border border-border rounded-xl text-xs text-text font-bold hover:bg-secondary/80 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>配色を反転する</span>
              </button>
            </div>

            {/* テキストとフォント */}
            <div className="border-t border-border pt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text/80 mb-1.5">
                  カスタム表示テキスト
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={`${width} × ${height}`}
                  className="theme-input w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">
                    フォントサイズ (px)
                  </label>
                  <div className="theme-input flex items-center gap-1 !p-0.5">
                    <button
                      onClick={() => setFontSize(Math.max(8, fontSize - 4))}
                      className="p-1.5 hover:bg-card rounded-lg cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="8"
                      max="300"
                      value={fontSize}
                      onChange={(e) => setFontSize(Math.max(8, Number(e.target.value)))}
                      className="w-full bg-transparent border-none text-center text-xs focus:outline-none focus:ring-0 font-mono text-text"
                    />
                    <button
                      onClick={() => setFontSize(fontSize + 4)}
                      className="p-1.5 hover:bg-card rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text/80 mb-1.5">
                    フォントファミリー
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="theme-select w-full text-xs"
                  >
                    <option value="Lexend">Lexend</option>
                    <option value="Space Grotesk">Space Grotesk</option>
                    <option value="Caveat">Caveat (手書き風)</option>
                    <option value="Sans">Sans-Serif</option>
                    <option value="Serif">Serif</option>
                    <option value="Monospace">Monospace</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
