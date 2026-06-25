'use client';

import { useState, useRef, useMemo } from 'react';
import { FileCode, Copy, Check, Image as ImageIcon, Code, Upload, RefreshCw } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

// ReactのSVG属性置換マップ
const SVG_ATTR_MAP: Record<string, string> = {
  class: 'className',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-rule': 'fillRule',
  'fill-opacity': 'fillOpacity',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'color-interpolation': 'colorInterpolation',
  'color-rendering': 'colorRendering',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor',
  'vector-effect': 'vectorEffect',
  'xml:space': 'xmlSpace',
};

// SVGをReact/JSX向けに変換する関数
function convertToJsx(svg: string): string {
  let result = svg.trim();

  // 1. コメントを除去
  result = result.replace(/<!--[\s\S]*?-->/g, '');

  // 2. 不要なメタデータタグを除去
  result = result.replace(/<\?xml[\s\S]*?\?>/i, '');
  result = result.replace(/<!DOCTYPE[\s\S]*?>/i, '');

  // 3. 属性の変換 (class -> className, stroke-width -> strokeWidth 等)
  Object.entries(SVG_ATTR_MAP).forEach(([kebab, camel]) => {
    // 属性の直前がスペースか改行であることを考慮
    const regex = new RegExp(`\\b${kebab}\\s*=`, 'g');
    result = result.replace(regex, `${camel}=`);
  });

  // 4. インラインスタイルの単純変換 (style="color: red; margin: 10px;" -> style={{color: 'red', margin: '10px'}})
  result = result.replace(/style="([^"]*)"/g, (match, styleStr: string) => {
    const properties = styleStr.split(';').filter((p) => p.trim());
    const reactStyles = properties
      .map((prop) => {
        const parts = prop.split(':');
        if (parts.length < 2) return '';
        const key = parts[0].trim().replace(/-([a-z])/g, (m, c: string) => c.toUpperCase());
        const val = parts.slice(1).join(':').trim().replace(/'/g, "\\'");
        return `${key}: '${val}'`;
      })
      .filter(Boolean)
      .join(', ');
    return `style={{ ${reactStyles} }}`;
  });

  return result;
}

// サンプルのSVG
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--accent, #10b981)" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="20" fill="url(#gradient)" />
  <circle cx="50" cy="50" r="25" fill="#ffffff" opacity="0.9" />
  <path d="M45 40 L60 50 L45 60 Z" fill="var(--accent, #10b981)" />
</svg>`;

export default function SvgToCssPage() {
  const [svgInput, setSvgInput] = useState<string>(SAMPLE_SVG);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SVG入力のクリーンアップ・バリデーション
  const cleanSvg = useMemo(() => {
    const trimmed = svgInput.trim();
    if (!trimmed) return '';

    // <svg で始まっていることを簡易検証
    if (!trimmed.toLowerCase().includes('<svg')) {
      return '';
    }
    return trimmed;
  }, [svgInput]);

  // Data URI (UTF-8 URLエンコード) の生成
  const dataUriUtf8 = useMemo(() => {
    if (!cleanSvg) return '';
    // SVGを安全にURLエンコード
    const encoded = encodeURIComponent(cleanSvg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
      .replace(/%20/g, ' '); // スペースは見やすさのため残す
    return `data:image/svg+xml,${encoded}`;
  }, [cleanSvg]);

  // Data URI (Base64) の生成
  const dataUriBase64 = useMemo(() => {
    if (!cleanSvg) return '';
    try {
      const base64 = btoa(unescape(encodeURIComponent(cleanSvg)));
      return `data:image/svg+xml;base64,${base64}`;
    } catch {
      return 'エラー: Base64変換に失敗しました。';
    }
  }, [cleanSvg]);

  // React JSX コードの生成
  const jsxCode = useMemo(() => {
    if (!cleanSvg) return '';
    return convertToJsx(cleanSvg);
  }, [cleanSvg]);

  // コピー処理
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ファイルアップロード処理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setSvgInput(text);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    setSvgInput(SAMPLE_SVG);
  };

  return (
    <ToolPageLayout
      title="SVG to CSS & Data URI Converter"
      description="SVGコードをCSS背景画像用のData URI (UTF-8 / Base64) やReactでそのまま使えるJSXコードに最適化・変換します。ブラウザ完結で安全です。"
      icon={FileCode}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側: 入力エリア */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
              <Code className="w-5 h-5 text-accent" />
              SVGコードを入力
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="theme-btn py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                ファイルを読み込む
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".svg"
                className="hidden"
              />
              <button
                onClick={handleReset}
                className="theme-btn py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer bg-secondary"
                title="サンプルに戻す"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                リセット
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              id="svg-input"
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              placeholder="ここに <svg>...</svg> のコードを入力、またはファイルをアップロードしてください..."
              rows={12}
              className="w-full p-4 bg-card border-2 border-border text-text font-mono text-xs md:text-sm rounded-xl focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[3px_3px_0px_0px_var(--border)] dark:focus:shadow-[3px_3px_0px_0px_var(--accent)] transition-all resize-y"
            />
          </div>

          {/* プレビュー表示 */}
          <div className="theme-card p-4 bg-secondary/50 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-xs font-bold text-text/50 mb-3 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              リアルタイムプレビュー
            </span>
            {cleanSvg ? (
              <div className="border border-dashed border-border p-4 bg-card rounded-lg flex items-center justify-center max-w-full max-h-[300px] overflow-auto">
                {/* 外部スクリプトインジェクション等のXSS対策としてimgタグのsrcにData URLを指定 */}
                <img
                  src={dataUriUtf8}
                  alt="SVG Preview"
                  className="max-w-[200px] max-h-[200px] object-contain"
                  onError={(e) => {
                    // 読み込みエラー時のフォールバック表示
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <p className="text-xs text-text/40 font-bold">有効なSVGを入力してください</p>
            )}
          </div>
        </div>

        {/* 右側: 変換結果出力 */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            <FileCode className="w-5 h-5 text-accent" />
            変換結果
          </h2>

          {/* 1. CSS Background (UTF-8) */}
          <div className="theme-card p-4 bg-card flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text flex flex-col">
                <span>CSS Background Image (UTF-8)</span>
                <span className="text-[10px] text-text/50 font-normal">
                  最も軽量で可読性が高い (推奨)
                </span>
              </span>
              <button
                disabled={!cleanSvg}
                onClick={() => handleCopy(`background-image: url("${dataUriUtf8}");`, 'css-utf8')}
                className="theme-btn py-1 px-2.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copiedKey === 'css-utf8' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === 'css-utf8' ? 'コピー完了' : 'コピー'}
              </button>
            </div>
            <pre className="p-3 bg-secondary rounded-lg font-mono text-xs text-text/80 break-all max-h-[96px] overflow-y-auto select-all">
              {cleanSvg ? `background-image: url("${dataUriUtf8}");` : '(SVGが未入力です)'}
            </pre>
          </div>

          {/* 2. CSS Background (Base64) */}
          <div className="theme-card p-4 bg-card flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text flex flex-col">
                <span>CSS Background Image (Base64)</span>
                <span className="text-[10px] text-text/50 font-normal">
                  エンコード済みバイナリテキスト
                </span>
              </span>
              <button
                disabled={!cleanSvg}
                onClick={() => handleCopy(`background-image: url("${dataUriBase64}");`, 'css-b64')}
                className="theme-btn py-1 px-2.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copiedKey === 'css-b64' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === 'css-b64' ? 'コピー完了' : 'コピー'}
              </button>
            </div>
            <pre className="p-3 bg-secondary rounded-lg font-mono text-xs text-text/80 break-all max-h-[96px] overflow-y-auto select-all">
              {cleanSvg ? `background-image: url("${dataUriBase64}");` : '(SVGが未入力です)'}
            </pre>
          </div>

          {/* 3. Raw Data URI (UTF-8) */}
          <div className="theme-card p-4 bg-card flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text flex flex-col">
                <span>Raw Data URI (UTF-8)</span>
                <span className="text-[10px] text-text/50 font-normal">
                  HTMLの &lt;img src=&quot;...&quot; /&gt; 等に使用可能
                </span>
              </span>
              <button
                disabled={!cleanSvg}
                onClick={() => handleCopy(dataUriUtf8, 'raw-uri')}
                className="theme-btn py-1 px-2.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copiedKey === 'raw-uri' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === 'raw-uri' ? 'コピー完了' : 'コピー'}
              </button>
            </div>
            <pre className="p-3 bg-secondary rounded-lg font-mono text-xs text-text/80 break-all max-h-[96px] overflow-y-auto select-all">
              {cleanSvg ? dataUriUtf8 : '(SVGが未入力です)'}
            </pre>
          </div>

          {/* 4. React JSX */}
          <div className="theme-card p-4 bg-card flex flex-col justify-between space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-text flex flex-col">
                <span>React / JSX Component Code</span>
                <span className="text-[10px] text-text/50 font-normal">
                  属性を React 用にキャメルケース化
                </span>
              </span>
              <button
                disabled={!cleanSvg}
                onClick={() => handleCopy(jsxCode, 'react-jsx')}
                className="theme-btn py-1 px-2.5 text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copiedKey === 'react-jsx' ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedKey === 'react-jsx' ? 'コピー完了' : 'コピー'}
              </button>
            </div>
            <pre className="p-3 bg-secondary rounded-lg font-mono text-xs text-text/80 whitespace-pre-wrap max-h-[150px] overflow-y-auto select-all">
              {cleanSvg ? jsxCode : '(SVGが未入力です)'}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
