// src/components/tools/css/CssGenerator.tsx
'use client';

import { useState } from 'react';
import { Layers, Sparkles, Sliders } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';

export default function CssGenerator() {
  const [activeTab, setActiveTab] = useState<'glass' | 'shadow'>('glass');

  // Glassmorphism state
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0.45);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState(0.25);
  const [borderWidth, setBorderWidth] = useState(1);
  const [bgStyle, setBgStyle] = useState<'gradient' | 'mesh' | 'sunset'>('gradient');

  // Shadow state
  const [shadowLayers, setShadowLayers] = useState(4);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.07);
  const [shadowBlur, setShadowBlur] = useState(30);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowOffset, setShadowOffset] = useState(10);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  };

  // Glassmorphism CSS output
  const glassCss = `background: ${hexToRgba(bgColor, opacity)};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${borderWidth}px solid ${hexToRgba(borderColor, borderOpacity)};
border-radius: 24px;`;

  // Smooth Shadow CSS calculation
  const generateSmoothShadow = () => {
    const shadows = [];
    for (let i = 1; i <= shadowLayers; i++) {
      const ratio = i / shadowLayers;
      // 指数関数的にパラメータを増大させて滑らかにする
      const currentOffset = shadowOffset * Math.pow(ratio, 2.5);
      const currentBlur = shadowBlur * Math.pow(ratio, 2);
      const currentOpacity = shadowOpacity * (1 - ratio * 0.4);
      const currentSpread = shadowSpread * ratio;
      shadows.push(
        `0px ${currentOffset.toFixed(1)}px ${currentBlur.toFixed(1)}px ${currentSpread.toFixed(
          1
        )}px ${hexToRgba(shadowColor, currentOpacity)}`
      );
    }
    return `box-shadow: ${shadows.join(',\n            ')};
border-radius: 24px;`;
  };

  const shadowCss = generateSmoothShadow();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* タブ切り替え */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-secondary/40 border-2 border-border rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('glass');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'glass'
                ? 'bg-accent text-white shadow-[2px_2px_0px_0px_var(--border)]'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Glassmorphism</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('shadow');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
              activeTab === 'shadow'
                ? 'bg-accent text-white shadow-[2px_2px_0px_0px_var(--border)]'
                : 'text-text/70 hover:text-text'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Smooth Shadow</span>
          </button>
        </div>
      </div>

      {/* メインエリア */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* コントロールパネル (左側: 5列) */}
        <div className="lg:col-span-5 bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-border/20">
            <Sliders className="w-5 h-5 text-accent" />
            <h2 className="font-extrabold text-base text-text">パラメータ調整</h2>
          </div>

          {activeTab === 'glass' ? (
            // Glassmorphism コントロール
            <div className="space-y-6">
              {/* ぼかし */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">背後ぼかし (Blur)</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {blur}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* 背景不透明度 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">背景不透明度 (Opacity)</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* 背景色選択 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text/80 mb-2">背景ベース色</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 border border-border rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text/80 mb-2">
                    ボーダーベース色
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-10 h-10 border border-border rounded-xl cursor-pointer"
                    />
                    <input
                      type="text"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent text-text"
                    />
                  </div>
                </div>
              </div>

              {/* 境界線不透明度 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">ボーダー不透明度</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {Math.round(borderOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* 境界線の太さ */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">ボーダー幅</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {borderWidth}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* プレビュー背景の切り替え */}
              <div>
                <label className="block text-xs font-bold text-text/80 mb-2">
                  背後のプレビュー背景
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['gradient', 'mesh', 'sunset'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setBgStyle(style)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        bgStyle === style
                          ? 'bg-accent/10 border-accent text-accent'
                          : 'bg-secondary/40 border-border text-text/80 hover:bg-secondary/60'
                      }`}
                    >
                      {style === 'gradient' ? 'Aurora' : style === 'mesh' ? 'Neon Mesh' : 'Sunset'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Smooth Shadow コントロール
            <div className="space-y-6">
              {/* レイヤー数 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">レイヤー重ね合わせ数</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {shadowLayers}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={shadowLayers}
                  onChange={(e) => setShadowLayers(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* 影の不透明度 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">影の不透明度 (Opacity)</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {Math.round(shadowOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* ぼかし量 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">最大ぼかし量 (Blur)</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {shadowBlur}px
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* オフセット */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-text/80">最大ズレ量 (Y Offset)</label>
                  <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded text-text/70">
                    {shadowOffset}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={shadowOffset}
                  onChange={(e) => setShadowOffset(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* 影の色選択 */}
              <div>
                <label className="block text-xs font-bold text-text/80 mb-2">影のカラー</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-10 h-10 border border-border rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-accent text-text"
                  />
                </div>
              </div>

              {/* プリセット調整ボタン */}
              <div>
                <label className="block text-xs font-bold text-text/80 mb-2 font-medium">
                  プリセット
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setShadowLayers(4);
                      setShadowOpacity(0.06);
                      setShadowBlur(30);
                      setShadowOffset(10);
                      setShadowSpread(0);
                    }}
                    className="py-1.5 px-2 bg-secondary/50 border border-border text-text/90 rounded-lg text-xs hover:bg-secondary transition-all cursor-pointer"
                  >
                    標準的
                  </button>
                  <button
                    onClick={() => {
                      setShadowLayers(6);
                      setShadowOpacity(0.12);
                      setShadowBlur(60);
                      setShadowOffset(25);
                      setShadowSpread(-2);
                    }}
                    className="py-1.5 px-2 bg-secondary/50 border border-border text-text/90 rounded-lg text-xs hover:bg-secondary transition-all cursor-pointer"
                  >
                    深く浮く
                  </button>
                  <button
                    onClick={() => {
                      setShadowLayers(3);
                      setShadowOpacity(0.04);
                      setShadowBlur(10);
                      setShadowOffset(3);
                      setShadowSpread(0);
                    }}
                    className="py-1.5 px-2 bg-secondary/50 border border-border text-text/90 rounded-lg text-xs hover:bg-secondary transition-all cursor-pointer"
                  >
                    フラット
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* プレビュー＆コード出力 (右側: 7列) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* プレビュー画面 */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden flex flex-col items-center justify-center min-h-[340px] relative">
            <span className="absolute top-4 left-4 text-xs font-bold text-text/40 tracking-wider uppercase">
              ライブプレビュー
            </span>

            {activeTab === 'glass' ? (
              // Glassmorphism プレビュー
              <div className="w-full h-full flex items-center justify-center min-h-[260px] rounded-2xl relative overflow-hidden transition-all">
                {/* 背景パターン */}
                {bgStyle === 'gradient' && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy" />
                )}
                {bgStyle === 'mesh' && (
                  <div className="absolute inset-0 bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.6),rgba(255,255,255,0))]" />
                )}
                {bgStyle === 'sunset' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 via-red-500 to-indigo-950" />
                )}

                {/* 浮かぶ幾何学図形 */}
                <div className="absolute w-24 h-24 rounded-full bg-yellow-300 left-12 top-6 animate-pulse opacity-80" />
                <div className="absolute w-32 h-32 bg-blue-400 right-10 bottom-6 rotate-45 rounded-lg opacity-70" />

                {/* プレビュー対象のグラスカード */}
                <div
                  style={{
                    background: hexToRgba(bgColor, opacity),
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    border: `${borderWidth}px solid ${hexToRgba(borderColor, borderOpacity)}`,
                    borderRadius: '24px',
                  }}
                  className="z-10 w-72 p-6 text-white shadow-xl flex flex-col gap-3 transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <h3 className="font-extrabold text-xl tracking-tight">Glassmorphism Card</h3>
                  <p className="text-white/80 text-xs leading-relaxed">
                    背景のぼかし（`backdrop-filter`）と透過ベース色による、すりガラスのような美しいフロストガラスエフェクトです。
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-[10px] text-white/60 font-mono">
                    <span>BLUR: {blur}px</span>
                    <span>OPACITY: {opacity}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Smooth Shadow プレビュー
              <div className="w-full h-full flex items-center justify-center min-h-[260px] bg-secondary/35 border border-border/10 rounded-2xl p-8 transition-colors">
                <div
                  style={{
                    boxShadow: shadowCss
                      .replace('box-shadow:', '')
                      .replace('border-radius: 24px;', '')
                      .trim()
                      .slice(0, -1),
                    backgroundColor: 'var(--color-bg-card)',
                    borderRadius: '24px',
                  }}
                  className="w-64 p-6 border border-border/30 text-text flex flex-col gap-3 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg font-bold">
                    ✨
                  </div>
                  <h3 className="font-extrabold text-lg tracking-tight">Smooth Shadow Card</h3>
                  <p className="text-text/70 text-xs leading-relaxed">
                    複数の異なる影のレイヤーを重ね合わせることで、通常の `box-shadow`
                    よりも本物の陰影に近い滑らかな立体感を表現できます。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* コード出力 */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm text-slate-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                CSSコード出力
              </span>
              <CopyButton
                value={activeTab === 'glass' ? glassCss : shadowCss}
                label="CSSコピー"
                copiedLabel="Copied!"
                copiedLabelClassName="text-green-400 font-bold"
                copiedIconClassName="w-3.5 h-3.5 text-green-400"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              />
            </div>

            <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {activeTab === 'glass' ? glassCss : shadowCss}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
