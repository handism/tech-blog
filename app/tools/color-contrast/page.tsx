'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useMemo } from 'react';
import { Eye, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

// HEXコードをRGBオブジェクトに変換
const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return null;

  let r = 0,
    g = 0,
    b = 0;
  if (cleanHex.length === 6) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  }
  return { r, g, b };
};

// RGBオブジェクトをHEXに変換
const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
    return hex.length === 1 ? '0' : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// RGBをHSLに変換
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// HSLをRGBに変換
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  h /= 360;
  let r = l,
    g = l,
    b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

// 相対輝度の計算
const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// コントラスト比の計算
const getContrastRatio = (lum1: number, lum2: number) => {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export default function ColorContrast() {
  const { copy } = useCopyToClipboard();
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#fafafa');
  const [copiedText, setCopiedText] = useState('');

  const contrastRatio = useMemo(() => {
    const fgRgb = hexToRgb(fgColor);
    const bgRgb = hexToRgb(bgColor);
    if (fgRgb && bgRgb) {
      const fgLum = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
      const bgLum = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
      return getContrastRatio(fgLum, bgLum);
    }
    return 1;
  }, [fgColor, bgColor]);

  const handleCopy = (text: string) => {
    copy(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleRandomize = () => {
    const r1 = Math.floor(Math.random() * 256);
    const g1 = Math.floor(Math.random() * 256);
    const b1 = Math.floor(Math.random() * 256);

    // 背景と文字の間にコントラストが生まれやすいように調整
    const isDarkBg = Math.random() > 0.5;
    const bg = isDarkBg
      ? rgbToHex(Math.floor(r1 * 0.3), Math.floor(g1 * 0.3), Math.floor(b1 * 0.3))
      : rgbToHex(
          200 + Math.floor(r1 * 0.2),
          200 + Math.floor(g1 * 0.2),
          200 + Math.floor(b1 * 0.2)
        );

    const fg = isDarkBg
      ? rgbToHex(
          200 + Math.floor(Math.random() * 55),
          200 + Math.floor(Math.random() * 55),
          200 + Math.floor(Math.random() * 55)
        )
      : rgbToHex(
          Math.floor(Math.random() * 80),
          Math.floor(Math.random() * 80),
          Math.floor(Math.random() * 80)
        );

    setBgColor(bg);
    setFgColor(fg);
  };

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  // 配色パレットの自動生成 (背景色をベースとする)
  const generatePalette = () => {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return [];
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const getHexFromHsl = (h: number, s: number, l: number) => {
      const itemRgb = hslToRgb(
        (h + 360) % 360,
        Math.max(0, Math.min(100, s)),
        Math.max(0, Math.min(100, l))
      );
      return rgbToHex(itemRgb.r, itemRgb.g, itemRgb.b);
    };

    return [
      { name: 'ベース（背景）', hex: bgColor },
      { name: '補色（反対色）', hex: getHexFromHsl(hsl.h + 180, hsl.s, hsl.l) },
      { name: '類似色 1', hex: getHexFromHsl(hsl.h - 30, hsl.s, hsl.l) },
      { name: '類似色 2', hex: getHexFromHsl(hsl.h + 30, hsl.s, hsl.l) },
      { name: 'トライアド 1', hex: getHexFromHsl(hsl.h + 120, hsl.s, hsl.l) },
      { name: 'トライアド 2', hex: getHexFromHsl(hsl.h + 240, hsl.s, hsl.l) },
      { name: 'ダークシェード', hex: getHexFromHsl(hsl.h, hsl.s, Math.max(10, hsl.l - 25)) },
      { name: 'ライトティント', hex: getHexFromHsl(hsl.h, hsl.s, Math.min(95, hsl.l + 25)) },
    ];
  };

  const palette = generatePalette();

  // WCAG基準の合否判定
  const passNormalAA = contrastRatio >= 4.5;
  const passNormalAAA = contrastRatio >= 7.0;
  const passLargeAA = contrastRatio >= 3.0;
  const passLargeAAA = contrastRatio >= 4.5;

  return (
    <ToolPageLayout
      title="Color Contrast & Palette"
      description="背景色と文字色のコントラスト比をWCAG 2.1基準に基づいて瞬時に検証し、同時に美しい調和パレットを作成します。"
      icon={Eye}
    >
      <div className="max-w-6xl mx-auto">
        {/* コントロール・メインエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 左側: 設定＆ステータス (5列) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* カラー調整カード */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-5">
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                  🎨 カラー調整
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={swapColors}
                    className="p-2 hover:bg-secondary rounded-xl transition-colors cursor-pointer text-text/75"
                    title="文字色と背景色を入れ替える"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    ランダム色
                  </button>
                </div>
              </div>

              {/* 背景色 */}
              <div>
                <label className="block text-sm font-semibold text-text/80 mb-2">
                  背景色 (Background)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 border border-border rounded-2xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    maxLength={7}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* 文字色 */}
              <div>
                <label className="block text-sm font-semibold text-text/80 mb-2">
                  文字色 (Foreground)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 border border-border rounded-2xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    maxLength={7}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>

            {/* コントラスト比判定結果 */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-1">
              <div>
                <h2 className="font-bold text-base md:text-lg mb-4 flex items-center gap-2">
                  📊 WCAG 2.1 判定結果
                </h2>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl md:text-5xl font-extrabold text-accent">
                    {contrastRatio.toFixed(2)}
                  </span>
                  <span className="text-sm text-text/60 font-semibold">: 1 の比率</span>
                </div>

                <div className="space-y-3">
                  {/* 通常テキスト (AA / AAA) */}
                  <div className="p-3 bg-secondary/30 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text/90">通常テキスト (18px未満)</p>
                      <p className="text-[10px] text-text/60">基準: AA (4.5:1) / AAA (7:1)</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          passNormalAA
                            ? 'bg-green-500/15 text-green-600'
                            : 'bg-red-500/15 text-red-600'
                        }`}
                      >
                        AA {passNormalAA ? 'PASS' : 'FAIL'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          passNormalAAA
                            ? 'bg-green-500/15 text-green-600'
                            : 'bg-red-500/15 text-red-600'
                        }`}
                      >
                        AAA {passNormalAAA ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>

                  {/* 大きなテキスト (AA / AAA) */}
                  <div className="p-3 bg-secondary/30 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-text/90">
                        大きなテキスト (18px以上 / 太字14px以上)
                      </p>
                      <p className="text-[10px] text-text/60">基準: AA (3:1) / AAA (4.5:1)</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          passLargeAA
                            ? 'bg-green-500/15 text-green-600'
                            : 'bg-red-500/15 text-red-600'
                        }`}
                      >
                        AA {passLargeAA ? 'PASS' : 'FAIL'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          passLargeAAA
                            ? 'bg-green-500/15 text-green-600'
                            : 'bg-red-500/15 text-red-600'
                        }`}
                      >
                        AAA {passLargeAAA ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {contrastRatio < 4.5 && (
                <div className="mt-4 flex items-start gap-2 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    この配色比率は4.5未満のため、視認性が低下している可能性があります。背景を暗くするか文字を明るくしてみてください。
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 右側: プレビュー＆配色パレット (7列) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* プレビュー画面 */}
            <div
              style={{ backgroundColor: bgColor }}
              className="border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center min-h-[300px] relative transition-colors"
            >
              <span
                style={{ color: fgColor, opacity: 0.5 }}
                className="absolute top-4 left-4 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                実機プレビュー
              </span>

              <div className="space-y-4">
                <h3
                  style={{ color: fgColor }}
                  className="text-2xl md:text-3xl font-extrabold tracking-tight transition-colors"
                >
                  見出しテキスト (Large Bold Text)
                </h3>
                <p
                  style={{ color: fgColor }}
                  className="text-sm md:text-base leading-relaxed opacity-90 transition-colors"
                >
                  ここは通常の本文テキスト（Normal Body
                  Text）です。読みやすさ、コントラスト比、そして全体的なデザインの調和をブラウザ上で直接確認できます。
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    style={{ backgroundColor: fgColor, color: bgColor }}
                    className="px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    プライマリーボタン
                  </button>
                  <button
                    style={{ borderColor: fgColor, color: fgColor }}
                    className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                  >
                    セカンダリー
                  </button>
                </div>
              </div>
            </div>

            {/* 配色パレット */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <h2 className="font-bold text-base md:text-lg mb-4 flex items-center gap-2">
                🌈 背景ベース配色パレット
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {palette.map((item, index) => (
                  <div
                    key={index}
                    className="border border-border/60 bg-bg rounded-2xl overflow-hidden flex flex-col p-2.5 group hover:border-accent/40 transition-all shadow-sm"
                  >
                    {/* カラーボックス */}
                    <div
                      style={{ backgroundColor: item.hex }}
                      className="w-full h-14 rounded-xl border border-border/30 mb-2 relative group-hover:scale-[1.02] transition-transform"
                    >
                      {/* クイック適用ボタン */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                        <button
                          onClick={() => setBgColor(item.hex)}
                          className="bg-white hover:bg-slate-100 text-slate-900 text-[10px] font-extrabold py-1 px-1.5 rounded-lg cursor-pointer transition-transform hover:scale-105"
                        >
                          背景
                        </button>
                        <button
                          onClick={() => setFgColor(item.hex)}
                          className="bg-white hover:bg-slate-100 text-slate-900 text-[10px] font-extrabold py-1 px-1.5 rounded-lg cursor-pointer transition-transform hover:scale-105"
                        >
                          文字
                        </button>
                      </div>
                    </div>
                    {/* ラベル・コード */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-text/60 truncate">
                        {item.name}
                      </span>
                      <button
                        onClick={() => handleCopy(item.hex)}
                        className="text-xs font-mono font-bold text-text hover:text-accent flex items-center justify-between transition-colors cursor-pointer text-left"
                      >
                        <span>{item.hex.toUpperCase()}</span>
                        {copiedText === item.hex ? (
                          <Check className="w-3 h-3 text-green-500 shrink-0" />
                        ) : (
                          <Copy className="w-3 h-3 text-text/30 group-hover:text-text/60 shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
