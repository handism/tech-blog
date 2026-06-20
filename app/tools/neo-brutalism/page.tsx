'use client';

import { useState, useMemo } from 'react';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

export default function NeoBrutalismGenerator() {
  // 状態管理
  const [borderWidth, setBorderWidth] = useState(3);
  const [borderRadius, setBorderRadius] = useState(16);
  const [shadowX, setShadowX] = useState(5);
  const [shadowY, setShadowY] = useState(5);

  const [borderColor, setBorderColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#10b981');

  const [copiedType, setCopiedType] = useState<'tailwind' | 'css' | null>(null);

  // プリセットパレット
  const PRESETS = [
    {
      name: 'Classic Yellow',
      bg: '#feffdb',
      border: '#000000',
      shadow: '#000000',
      text: '#000000',
      accent: '#ff5c00',
    },
    {
      name: 'Neon Green',
      bg: '#ffffff',
      border: '#000000',
      shadow: '#39ff14',
      text: '#000000',
      accent: '#39ff14',
    },
    {
      name: 'Cyberpunk Purple',
      bg: '#120024',
      border: '#00ffff',
      shadow: '#ff00ff',
      text: '#ffffff',
      accent: '#ff00ff',
    },
    {
      name: 'Soft Peach',
      bg: '#fff0ea',
      border: '#1e1e24',
      shadow: '#ff7a5c',
      text: '#1e1e24',
      accent: '#ff7a5c',
    },
    {
      name: 'Midnight Neon',
      bg: '#121212',
      border: '#ffffff',
      shadow: '#10b981',
      text: '#ffffff',
      accent: '#10b981',
    },
  ];

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setBgColor(preset.bg);
    setBorderColor(preset.border);
    setShadowColor(preset.shadow);
    setTextColor(preset.text);
    setAccentColor(preset.accent);
  };

  const resetParams = () => {
    setBorderWidth(3);
    setBorderRadius(16);
    setShadowX(5);
    setShadowY(5);
    setBgColor('#ffffff');
    setBorderColor('#000000');
    setShadowColor('#000000');
    setTextColor('#000000');
    setAccentColor('#10b981');
  };

  // CSSスタイルの生成
  const generatedStyles = useMemo(() => {
    const cardStyle = {
      backgroundColor: bgColor,
      color: textColor,
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: `${borderRadius}px`,
      boxShadow: `${shadowX}px ${shadowY}px 0px 0px ${shadowColor}`,
    };

    const buttonStyle = {
      backgroundColor: accentColor,
      color: '#ffffff',
      border: `${Math.max(2, borderWidth - 1)}px solid ${borderColor}`,
      borderRadius: `${Math.min(12, borderRadius)}px`,
      boxShadow: `${Math.max(2, shadowX - 2)}px ${Math.max(2, shadowY - 2)}px 0px 0px ${shadowColor}`,
    };

    return { cardStyle, buttonStyle };
  }, [
    borderWidth,
    borderRadius,
    shadowX,
    shadowY,
    borderColor,
    bgColor,
    textColor,
    shadowColor,
    accentColor,
  ]);

  // CSSコード文字列の生成
  const cssCode = useMemo(() => {
    return `.theme-card {
  background-color: ${bgColor};
  color: ${textColor};
  border: ${borderWidth}px solid ${borderColor};
  border-radius: ${borderRadius}px;
  box-shadow: ${shadowX}px ${shadowY}px 0px 0px ${shadowColor};
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.theme-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: ${shadowX + 2}px ${shadowY + 2}px 0px 0px ${shadowColor};
}

.theme-btn {
  background-color: ${accentColor};
  border: ${Math.max(2, borderWidth - 1)}px solid ${borderColor};
  border-radius: ${Math.min(12, borderRadius)}px;
  box-shadow: ${Math.max(2, shadowX - 2)}px ${Math.max(2, shadowY - 2)}px 0px 0px ${shadowColor};
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.theme-btn:active {
  transform: translate(${Math.max(2, shadowX - 2)}px, ${Math.max(2, shadowY - 2)}px);
  box-shadow: 0px 0px 0px 0px ${shadowColor};
}`;
  }, [
    borderWidth,
    borderRadius,
    shadowX,
    shadowY,
    borderColor,
    bgColor,
    textColor,
    shadowColor,
    accentColor,
  ]);

  // Tailwind CSSコード文字列の生成 (近似値表現)
  const tailwindCode = useMemo(() => {
    return `<!-- Card -->
<div class="bg-[${bgColor}] text-[${textColor}] border-[${borderWidth}px] border-[${borderColor}] rounded-[${borderRadius}px] shadow-[${shadowX}px_${shadowY}px_0px_0px_${shadowColor}] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[${shadowX + 2}px_${shadowY + 2}px_0px_0px_${shadowColor}] p-6">
  <h2 class="text-xl font-bold mb-2">Card Title</h2>
  <p class="mb-4">Card content goes here...</p>
  
  <!-- Button -->
  <button class="bg-[${accentColor}] text-white font-bold py-2 px-4 border-[${Math.max(2, borderWidth - 1)}px] border-[${borderColor}] rounded-[${Math.min(12, borderRadius)}px] shadow-[${Math.max(2, shadowX - 2)}px_${Math.max(2, shadowY - 2)}px_0px_0px_${shadowColor}] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
    Action
  </button>
</div>`;
  }, [
    borderWidth,
    borderRadius,
    shadowX,
    shadowY,
    borderColor,
    bgColor,
    textColor,
    shadowColor,
    accentColor,
  ]);

  const handleCopy = (code: string, type: 'tailwind' | 'css') => {
    navigator.clipboard.writeText(code);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <ToolPageLayout
      title="Neo-Brutalism UI Generator"
      description="太い境界線、ぼかしのない明確なドロップシャドウ、ビビッドな配色といったネオ・ブルータリズムデザインのスタイルコードを視覚的に調整しながら作成できるジェネレーターです。"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* コントロールパネル */}
        <div className="lg:col-span-5 space-y-6">
          {/* パラメータ調整 */}
          <div className="theme-card p-6 space-y-5">
            <div className="flex justify-between items-center border-b-2 border-border pb-3">
              <h3 className="font-extrabold text-lg flex items-center gap-1.5">
                <span>🛠️</span> パラメータ設定
              </h3>
              <button
                onClick={resetParams}
                className="theme-btn p-2 text-xs flex items-center gap-1 hover:text-accent"
                title="リセット"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>リセット</span>
              </button>
            </div>

            {/* スライダー */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>境界線の太さ: {borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={borderWidth}
                  onChange={(e) => setBorderWidth(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>角丸の大きさ: {borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>シャドウ幅 (X軸): {shadowX}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={shadowX}
                  onChange={(e) => setShadowX(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span>シャドウ高 (Y軸): {shadowY}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={shadowY}
                  onChange={(e) => setShadowY(Number(e.target.value))}
                  className="w-full accent-accent bg-secondary rounded-lg h-2"
                />
              </div>
            </div>

            {/* カラーピッカー */}
            <div className="space-y-3 pt-3 border-t border-border/10">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text/60">
                カラー設定
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-bold">背景色</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-bold">テキスト色</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-bold">枠線色</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-bold">影色</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-bold">ボタン/アクセント色</span>
                </div>
              </div>
            </div>
          </div>

          {/* プリセット */}
          <div className="theme-card p-6">
            <h3 className="font-extrabold text-sm mb-3">🎨 プリセットスタイル</h3>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* プレビュー ＆ コード出力 */}
        <div className="lg:col-span-7 space-y-6">
          {/* プレビュー表示エリア */}
          <div className="theme-card p-6 bg-[#eaeaea] dark:bg-[#222222] min-h-[300px] flex items-center justify-center relative">
            <span className="absolute top-3 left-3 text-[10px] bg-black text-white px-2 py-0.5 rounded font-black uppercase tracking-widest opacity-60">
              Preview Area
            </span>

            {/* 出現するカードのプレビュー */}
            <div
              style={generatedStyles.cardStyle}
              className="p-6 md:p-8 max-w-sm w-full transition-all duration-75"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚡</span>
                <h4 className="text-xl font-black">Ne Brutalism</h4>
              </div>
              <p className="text-xs md:text-sm font-medium mb-5 opacity-90 leading-relaxed">
                これはネオブルータリズムのライブプレビューです。左側のパラメータを動かして好みの影や枠線を調整しましょう。
              </p>
              <button
                style={generatedStyles.buttonStyle}
                className="px-4 py-2 text-xs md:text-sm font-extrabold cursor-pointer transition-all duration-75 hover:opacity-90 active:scale-95"
              >
                詳細はこちら
              </button>
            </div>
          </div>

          {/* コード出力エリア */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSS */}
            <div className="theme-card p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-extrabold">Vanilla CSS</h4>
                  <button
                    onClick={() => handleCopy(cssCode, 'css')}
                    className="theme-btn p-1.5 text-xs flex items-center gap-1"
                  >
                    {copiedType === 'css' ? (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'css' ? 'コピー済' : 'コピー'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 bg-secondary text-text rounded-lg overflow-x-auto max-h-[220px]">
                  {cssCode}
                </pre>
              </div>
            </div>

            {/* Tailwind */}
            <div className="theme-card p-4 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-extrabold">Tailwind HTML</h4>
                  <button
                    onClick={() => handleCopy(tailwindCode, 'tailwind')}
                    className="theme-btn p-1.5 text-xs flex items-center gap-1"
                  >
                    {copiedType === 'tailwind' ? (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedType === 'tailwind' ? 'コピー済' : 'コピー'}</span>
                  </button>
                </div>
                <pre className="text-[10px] font-mono p-3 bg-secondary text-text rounded-lg overflow-x-auto max-h-[220px] whitespace-pre-wrap">
                  {tailwindCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
