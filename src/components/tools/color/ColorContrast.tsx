// src/components/tools/color/ColorContrast.tsx
'use client';

import { useState, useMemo } from 'react';
import { AlertCircle, ChartColumn, Eye, Palette, RefreshCw } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';
import {
  getContrastRatio,
  getLuminance,
  hexToRgb,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
} from '@/src/lib/color';

export default function ColorContrast() {
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FAFAFA');

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

  const handleRandomize = () => {
    const r1 = Math.floor(Math.random() * 256);
    const g1 = Math.floor(Math.random() * 256);
    const b1 = Math.floor(Math.random() * 256);

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

    setBgColor(bg.toUpperCase());
    setFgColor(fg.toUpperCase());
  };

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  // 配色パレットの自動生成 (背景色をベースとする)
  const palette = useMemo(() => {
    const rgb = hexToRgb(bgColor);
    if (!rgb) return [];
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const getHexFromHsl = (h: number, s: number, l: number) => {
      const itemRgb = hslToRgb(
        (h + 360) % 360,
        Math.max(0, Math.min(100, s)),
        Math.max(0, Math.min(100, l))
      );
      return rgbToHex(itemRgb.r, itemRgb.g, itemRgb.b).toUpperCase();
    };

    return [
      { name: 'ベース（背景）', hex: bgColor.toUpperCase() },
      { name: '補色（反対色）', hex: getHexFromHsl(hsl.h + 180, hsl.s, hsl.l) },
      { name: '類似色 1', hex: getHexFromHsl(hsl.h - 30, hsl.s, hsl.l) },
      { name: '類似色 2', hex: getHexFromHsl(hsl.h + 30, hsl.s, hsl.l) },
      { name: 'トライアド 1', hex: getHexFromHsl(hsl.h + 120, hsl.s, hsl.l) },
      { name: 'トライアド 2', hex: getHexFromHsl(hsl.h + 240, hsl.s, hsl.l) },
      { name: 'ダークシェード', hex: getHexFromHsl(hsl.h, hsl.s, Math.max(10, hsl.l - 25)) },
      { name: 'ライトティント', hex: getHexFromHsl(hsl.h, hsl.s, Math.min(95, hsl.l + 25)) },
    ];
  }, [bgColor]);

  // WCAG基準の合否判定
  const passNormalAA = contrastRatio >= 4.5;
  const passNormalAAA = contrastRatio >= 7.0;
  const passLargeAA = contrastRatio >= 3.0;
  const passLargeAAA = contrastRatio >= 4.5;

  return (
    <div className="max-w-6xl mx-auto text-text animate-none">
      {/* コントロール・メインエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* 左側: 設定＆ステータス (5列) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* カラー調整カード */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b-2 border-border/20">
              <h2 className="font-extrabold text-sm md:text-base flex items-center gap-2">
                <Palette className="w-4 h-4 inline-block align-[-0.15em] mr-1" /> カラー調整
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
                  className="theme-btn px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border-2 border-border text-accent rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[2px_2px_0px_0px_var(--border)]"
                >
                  ランダム色
                </button>
              </div>
            </div>

            {/* 背景色 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-text/60 uppercase tracking-wider">
                背景色 (Background)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-12 h-12 border-2 border-border rounded-2xl cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  maxLength={7}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-full bg-secondary/30 border-2 border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent font-bold shadow-inner"
                />
              </div>
            </div>

            {/* 文字色 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-text/60 uppercase tracking-wider">
                文字色 (Foreground)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  className="w-12 h-12 border-2 border-border rounded-2xl cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  maxLength={7}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  className="w-full bg-secondary/30 border-2 border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* コントラスト比判定結果 */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col justify-between flex-1">
            <div>
              <h2 className="font-extrabold text-sm md:text-base mb-4 flex items-center gap-2">
                <ChartColumn className="w-4 h-4 inline-block align-[-0.15em] mr-1" /> WCAG 2.1
                判定結果
              </h2>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl md:text-5xl font-black text-accent">
                  {contrastRatio.toFixed(2)}
                </span>
                <span className="text-xs text-text/60 font-black uppercase tracking-wider">
                  : 1 の比率
                </span>
              </div>

              <div className="space-y-3">
                {/* 通常テキスト (AA / AAA) */}
                <div className="p-3 bg-secondary/35 border-2 border-border rounded-xl flex items-center justify-between shadow-sm font-bold">
                  <div>
                    <p className="text-xs font-bold text-text/90">通常テキスト (18px未満)</p>
                    <p className="text-[10px] text-text/60 font-medium">
                      基準: AA (4.5:1) / AAA (7:1)
                    </p>
                  </div>
                  <div className="flex gap-1.5 font-black">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border border-border shadow-sm ${
                        passNormalAA
                          ? 'bg-green-500/15 text-green-600 border-green-500/30'
                          : 'bg-red-500/15 text-red-600 border-red-500/30'
                      }`}
                    >
                      AA {passNormalAA ? 'PASS' : 'FAIL'}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border border-border shadow-sm ${
                        passNormalAAA
                          ? 'bg-green-500/15 text-green-600 border-green-500/30'
                          : 'bg-red-500/15 text-red-600 border-red-500/30'
                      }`}
                    >
                      AAA {passNormalAAA ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>

                {/* 大きなテキスト (AA / AAA) */}
                <div className="p-3 bg-secondary/35 border-2 border-border rounded-xl flex items-center justify-between shadow-sm font-bold">
                  <div>
                    <p className="text-xs font-bold text-text/90">
                      大きなテキスト (18px以上 / 太字14px以上)
                    </p>
                    <p className="text-[10px] text-text/60 font-medium">
                      基準: AA (3:1) / AAA (4.5:1)
                    </p>
                  </div>
                  <div className="flex gap-1.5 font-black">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border border-border shadow-sm ${
                        passLargeAA
                          ? 'bg-green-500/15 text-green-600 border-green-500/30'
                          : 'bg-red-500/15 text-red-600 border-red-500/30'
                      }`}
                    >
                      AA {passLargeAA ? 'PASS' : 'FAIL'}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full border border-border shadow-sm ${
                        passLargeAAA
                          ? 'bg-green-500/15 text-green-600 border-green-500/30'
                          : 'bg-red-500/15 text-red-600 border-red-500/30'
                      }`}
                    >
                      AAA {passLargeAAA ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {contrastRatio < 4.5 && (
              <div className="mt-4 flex items-start gap-2.5 text-xs bg-amber-500/10 border-2 border-amber-500 text-amber-600 dark:text-amber-400 p-3.5 rounded-2xl font-bold shadow-sm">
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
            className="border-2 border-border rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col justify-center min-h-[300px] relative transition-colors"
          >
            <span
              style={{ color: fgColor, opacity: 0.6 }}
              className="absolute top-4 left-4 text-xs font-black tracking-wider uppercase flex items-center gap-1.5"
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
                className="text-sm md:text-base leading-relaxed opacity-90 transition-colors font-bold"
              >
                ここは通常の本文テキスト（Normal Body
                Text）です。読みやすさ、コントラスト比、そして全体的なデザインの調和をブラウザ上で直接確認できます。
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  style={{ backgroundColor: fgColor, color: bgColor }}
                  className="px-4 py-2 rounded-xl text-xs font-black shadow-md border-2 border-border hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                >
                  プライマリーボタン
                </button>
                <button
                  style={{ borderColor: fgColor, color: fgColor }}
                  className="px-4 py-2 border-2 rounded-xl text-xs font-black hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                >
                  セカンダリー
                </button>
              </div>
            </div>
          </div>

          {/* 配色パレット */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)]">
            <h2 className="font-extrabold text-sm md:text-base mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 inline-block align-[-0.15em] mr-1" />{' '}
              背景ベース配色パレット
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {palette.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-border bg-bg rounded-2xl overflow-hidden flex flex-col p-2.5 group hover:border-accent/40 transition-all shadow-[2px_2px_0px_0px_var(--border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)]"
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
                        className="bg-white hover:bg-slate-100 text-slate-900 text-[9px] font-black py-1 px-1.5 rounded-lg cursor-pointer transition-transform hover:scale-105"
                      >
                        背景
                      </button>
                      <button
                        onClick={() => setFgColor(item.hex)}
                        className="bg-white hover:bg-slate-100 text-slate-900 text-[9px] font-black py-1 px-1.5 rounded-lg cursor-pointer transition-transform hover:scale-105"
                      >
                        文字
                      </button>
                    </div>
                  </div>
                  {/* ラベル・コード */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-extrabold text-text/50 truncate">
                      {item.name}
                    </span>
                    <CopyButton
                      value={item.hex}
                      label={item.hex}
                      copiedLabel={item.hex}
                      className="text-xs font-mono font-black text-text hover:text-accent flex items-center justify-between transition-colors cursor-pointer text-left w-full mt-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
