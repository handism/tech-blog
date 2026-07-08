// src/components/tools/css/CssUnit.tsx
'use client';

import { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

type UnitType = 'px' | 'rem' | 'em' | 'vw' | 'vh' | '%';

export default function CssUnit() {
  const { copy } = useCopyToClipboard();
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [viewportHeight, setViewportHeight] = useState<number>(1080);
  const [parentWidth, setParentWidth] = useState<number>(800);

  // 各単位の値の状態管理
  const [pxVal, setPxVal] = useState<string>('16');
  const [remVal, setRemVal] = useState<string>('1');
  const [emVal, setEmVal] = useState<string>('1');
  const [vwVal, setVwVal] = useState<string>('0.833');
  const [vhVal, setVhVal] = useState<string>('1.481');
  const [percentVal, setPercentVal] = useState<string>('2');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const formatNumber = (num: number): string => {
    if (isNaN(num)) return '';
    // 小数点第4位まで表示し、不要な末尾の0は削除
    return parseFloat(num.toFixed(4)).toString();
  };

  const handleInputChange = (value: string, unit: UnitType) => {
    if (value === '') {
      clearAllValues();
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      updateValState(value, unit);
      return;
    }

    updateValState(value, unit);

    let calculatedPx = 0;
    switch (unit) {
      case 'px':
        calculatedPx = num;
        break;
      case 'rem':
        calculatedPx = num * baseFontSize;
        break;
      case 'em':
        calculatedPx = num * baseFontSize;
        break;
      case 'vw':
        calculatedPx = (num / 100) * viewportWidth;
        break;
      case 'vh':
        calculatedPx = (num / 100) * viewportHeight;
        break;
      case '%':
        calculatedPx = (num / 100) * parentWidth;
        break;
    }

    // 入力した単位以外の値を更新
    if (unit !== 'px') setPxVal(formatNumber(calculatedPx));
    if (unit !== 'rem') setRemVal(formatNumber(calculatedPx / baseFontSize));
    if (unit !== 'em') setEmVal(formatNumber(calculatedPx / baseFontSize));
    if (unit !== 'vw') setVwVal(formatNumber((calculatedPx / viewportWidth) * 100));
    if (unit !== 'vh') setVhVal(formatNumber((calculatedPx / viewportHeight) * 100));
    if (unit !== '%') setPercentVal(formatNumber((calculatedPx / parentWidth) * 100));
  };

  const updateValState = (value: string, unit: string) => {
    if (unit === 'px') setPxVal(value);
    if (unit === 'rem') setRemVal(value);
    if (unit === 'em') setEmVal(value);
    if (unit === 'vw') setVwVal(value);
    if (unit === 'vh') setVhVal(value);
    if (unit === '%') setPercentVal(value);
  };

  const clearAllValues = () => {
    setPxVal('');
    setRemVal('');
    setEmVal('');
    setVwVal('');
    setVhVal('');
    setPercentVal('');
  };

  // 基準値が変更されたときに現在の px 基準で再計算するハンドラ
  const handleBaseFontSizeChange = (val: number) => {
    setBaseFontSize(val);
    const px = parseFloat(pxVal);
    if (!isNaN(px)) {
      setRemVal(formatNumber(px / val));
      setEmVal(formatNumber(px / val));
    }
  };

  const handleViewportWidthChange = (val: number) => {
    setViewportWidth(val);
    const px = parseFloat(pxVal);
    if (!isNaN(px)) {
      setVwVal(formatNumber((px / val) * 100));
    }
  };

  const handleViewportHeightChange = (val: number) => {
    setViewportHeight(val);
    const px = parseFloat(pxVal);
    if (!isNaN(px)) {
      setVhVal(formatNumber((px / val) * 100));
    }
  };

  const handleParentWidthChange = (val: number) => {
    setParentWidth(val);
    const px = parseFloat(pxVal);
    if (!isNaN(px)) {
      setPercentVal(formatNumber((px / val) * 100));
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    copy(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const units = [
    {
      key: 'px' as const,
      label: 'ピクセル (px)',
      value: pxVal,
      suffix: 'px',
      desc: '基本となる物理サイズ（絶対単位）',
    },
    {
      key: 'rem' as const,
      label: 'ルート相対 (rem)',
      value: remVal,
      suffix: 'rem',
      desc: 'ルート要素 (<html>) のフォントサイズに対する相対サイズ',
    },
    {
      key: 'em' as const,
      label: '親要素相対 (em)',
      value: emVal,
      suffix: 'em',
      desc: '現在の要素または親要素のフォントサイズに対する相対サイズ',
    },
    {
      key: 'vw' as const,
      label: 'ビューポート幅 (vw)',
      value: vwVal,
      suffix: 'vw',
      desc: '画面幅（ビューポート幅）に対する割合 (1vw = 幅 of 1%)',
    },
    {
      key: 'vh' as const,
      label: 'ビューポート高 (vh)',
      value: vhVal,
      suffix: 'vh',
      desc: '画面高（ビューポート高）に対する割合 (1vh = 高さ of 1%)',
    },
    {
      key: '%' as const,
      label: 'パーセント (%)',
      value: percentVal,
      suffix: '%',
      desc: '親要素の幅やサイズに対する割合',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 基準設定パネル */}
      <div className="lg:col-span-1 space-y-6">
        <div className="theme-card p-5 md:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] bg-card">
          <h2 className="text-sm font-black text-text mb-4 border-b-2 border-border pb-2 flex items-center gap-2">
            <span>⚙️ 基準値の設定</span>
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-text mb-1.5">
                Base Font Size (remの基準)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={baseFontSize}
                  onChange={(e) => handleBaseFontSizeChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-sm font-bold text-text">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-text mb-1.5">
                Viewport Width (vwの基準)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={viewportWidth}
                  onChange={(e) => handleViewportWidthChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-sm font-bold text-text">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-text mb-1.5">
                Viewport Height (vhの基準)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={viewportHeight}
                  onChange={(e) => handleViewportHeightChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-sm font-bold text-text">px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-text mb-1.5">
                Parent Element Width (%の基準)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={parentWidth}
                  onChange={(e) => handleParentWidthChange(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-card border-2 border-border text-text rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-sm font-bold text-text">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 変換器メインパネル */}
      <div className="lg:col-span-2">
        <div className="theme-card p-5 md:p-6 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] bg-card">
          <h2 className="text-sm font-black text-text mb-6 border-b-2 border-border pb-2 flex items-center justify-between">
            <span>🔄 相互変換 (任意の値を編集してください)</span>
            <button
              onClick={clearAllValues}
              className="theme-btn px-3 py-1 text-xs text-text bg-secondary cursor-pointer shadow-[1.5px_1.5px_0px_0px_var(--border)]"
            >
              クリア
            </button>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.map((unit) => (
              <div key={unit.key} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-text">{unit.label}</span>
                  <span className="text-[10px] text-text/60 font-medium">{unit.desc}</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={unit.value}
                    onChange={(e) => handleInputChange(e.target.value, unit.key)}
                    className="w-full pl-4 pr-24 py-3 bg-card border-2 border-border text-text rounded-xl font-mono font-bold text-base focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[2px_2px_0px_0px_var(--border)] transition-all"
                    placeholder={`値を入力 (${unit.suffix})`}
                  />
                  <div className="absolute right-2 flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-text/50 bg-secondary px-2 py-1 border border-border rounded-lg select-none">
                      {unit.suffix}
                    </span>
                    <button
                      onClick={() => handleCopy(`${unit.value}${unit.suffix}`, unit.key)}
                      disabled={!unit.value}
                      className="p-1.5 border-2 border-border rounded-lg bg-card hover:bg-secondary text-text disabled:opacity-40 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] flex items-center justify-center shrink-0"
                      title="コピー"
                    >
                      {copiedKey === unit.key ? (
                        <Check className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Clipboard className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
