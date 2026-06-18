'use client';

import { useState, useMemo } from 'react';
import { Palette, Clipboard, Check, Eye } from 'lucide-react';

export default function SvgEditorPage() {
  const [inputSvg, setInputSvg] = useState(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- サンプル星型アイコン -->
  <polygon points="50,9 61,35 89,35 66,51 75,78 50,61 25,78 34,51 11,35 39,35" fill="#10b981" stroke="#000000" stroke-width="3"/>
</svg>`
  );
  const [fillColor, setFillColor] = useState('');
  const [strokeColor, setStrokeColor] = useState('');
  const [copied, setCopied] = useState(false);

  // SVGプレビューの安全性を考慮したサニタイズ（簡易版）
  const sanitizeForPreview = (svgStr: string): string => {
    // scriptタグを完全に除去
    let cleaned = svgStr.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
    // javascript:を含むイベントハンドラを除去 (onload, onclick 等)
    cleaned = cleaned.replace(/on[a-z]+="[^"]*"/gi, '');
    cleaned = cleaned.replace(/href="javascript:[^"]*"/gi, '');
    return cleaned;
  };

  const optimizeSvg = (svg: string): string => {
    let res = svg.trim();
    // コメントの削除
    res = res.replace(/<!--[\s\S]*?-->/g, '');
    // XML宣言、DOCTYPEの削除
    res = res.replace(/<\?xml[\s\S]*?\?>/g, '');
    res = res.replace(/<!DOCTYPE[\s\S]*?>/g, '');
    // InkscapeやIllustratorの独自属性・メタデータを削除
    res = res.replace(/xmlns:(sodipodi|inkscape|illustrator|adobe)="[^"]*"/gi, '');
    res = res.replace(/(sodipodi|inkscape|i|a):[a-z-]+="[^"]*"/gi, '');
    // 空白文字の圧縮
    res = res.replace(/\s+/g, ' ');
    res = res.replace(/>\s+</g, '><');
    return res.trim();
  };

  const sanitizedPreview = useMemo(() => {
    return sanitizeForPreview(inputSvg);
  }, [inputSvg]);

  const outputSvg = useMemo(() => {
    let currentSvg = inputSvg;

    // カラー置換の処理
    if (fillColor) {
      if (/fill="[^"]*"/i.test(currentSvg)) {
        currentSvg = currentSvg.replace(/fill="[^"]*"/gi, `fill="${fillColor}"`);
      } else {
        currentSvg = currentSvg.replace(/<svg([^>]+)>/i, `<svg$1 fill="${fillColor}">`);
      }
    }

    if (strokeColor) {
      if (/stroke="[^"]*"/i.test(currentSvg)) {
        currentSvg = currentSvg.replace(/stroke="[^"]*"/gi, `stroke="${strokeColor}"`);
      } else {
        currentSvg = currentSvg.replace(/<svg([^>]+)>/i, `<svg$1 stroke="${strokeColor}">`);
      }
    }

    return optimizeSvg(currentSvg);
  }, [inputSvg, fillColor, strokeColor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormatInput = () => {
    // 入力を簡易インデント整形
    const formatted = inputSvg
      .trim()
      .replace(/>\s*</g, '>\n<') // 各タグで改行
      .replace(/ xmlns/g, '\n  xmlns') // 属性を整理
      .replace(/ viewBox/g, '\n  viewBox');
    setInputSvg(formatted);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Image Utilities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            SVG Path Visualizer & Optimizer
          </h1>
          <p className="text-text/80 text-sm md:text-base font-medium mt-2">
            ペーストしたSVGコードのプレビュー表示と、余分なメタデータや空白のクリーンアップ、カラー変更テストを行います。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: SVGコード入力 */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="neo-card p-5 md:p-6 flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="svg-input" className="text-sm font-bold text-text">
                📥 SVGコード入力
              </label>
              <button
                onClick={handleFormatInput}
                className="neo-btn px-2.5 py-1 text-xs bg-secondary"
              >
                簡易整形
              </button>
            </div>
            <textarea
              id="svg-input"
              className="w-full flex-1 p-3 border-2 border-border rounded-xl font-mono text-xs bg-card text-text focus:outline-none resize-none overflow-y-auto"
              value={inputSvg}
              onChange={(e) => setInputSvg(e.target.value)}
              placeholder="ここに<svg>...</svg>コードを貼り付けてください。"
            />
          </div>

          {/* カラー置換パネル */}
          <div className="neo-card p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-bold text-text border-b border-border pb-1.5 flex items-center gap-1.5">
              🎨 カラー一括置換テスト
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-text/70 mb-1.5">
                  ぬりつぶし色 (fill)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={fillColor || '#ffffff'}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="例: #10b981 または none"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs border-2 border-border rounded-lg bg-card font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-text/70 mb-1.5">
                  線の色 (stroke)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={strokeColor || '#000000'}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="例: #000000"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs border-2 border-border rounded-lg bg-card font-mono"
                  />
                </div>
              </div>
            </div>
            {(fillColor || strokeColor) && (
              <button
                onClick={() => {
                  setFillColor('');
                  setStrokeColor('');
                }}
                className="w-full neo-btn py-1.5 text-xs bg-secondary"
              >
                カラー設定をリセット
              </button>
            )}
          </div>
        </div>

        {/* 右カラム: プレビュー & 最適化結果 */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* プレビュー */}
          <div className="neo-card p-5 md:p-6 flex flex-col h-[280px]">
            <h3 className="text-sm font-bold text-text border-b-2 border-border pb-2 flex items-center gap-1.5 mb-4">
              <Eye className="w-4 h-4" />
              <span>プレビュー表示</span>
            </h3>
            <div className="flex-1 border-2 border-dashed border-border/40 rounded-xl bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,8px_0px] flex items-center justify-center overflow-hidden p-4">
              {sanitizedPreview ? (
                <div
                  className="max-w-full max-h-full flex items-center justify-center scale-150 transition-transform"
                  dangerouslySetInnerHTML={{ __html: sanitizedPreview }}
                />
              ) : (
                <span className="text-xs text-text/40 font-bold">有効なSVGを入力してください</span>
              )}
            </div>
          </div>

          {/* 最適化コード出力 */}
          <div className="neo-card p-5 md:p-6 flex flex-col h-[280px] relative min-h-0">
            <h3 className="text-sm font-bold text-text border-b-2 border-border pb-2 flex items-center justify-between mb-4">
              <span>⚡ 最適化結果 (圧縮コード)</span>
              {outputSvg && (
                <button
                  onClick={handleCopy}
                  className="neo-btn p-1.5 bg-secondary text-text flex items-center justify-center"
                  title="最適化コードをコピー"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Clipboard className="w-4 h-4" />
                  )}
                </button>
              )}
            </h3>
            <pre className="flex-1 w-full p-3 border-2 border-border rounded-xl font-mono text-xs bg-slate-950 text-slate-100 overflow-y-auto whitespace-pre-wrap break-all">
              {outputSvg || '// 最適化後のSVGコードがここに表示されます。'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
