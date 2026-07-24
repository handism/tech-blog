'use client';

import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';
import {
  calculateTargetDimension,
  calculateSimplifiedRatio,
  parseNumberInput,
} from '@/src/lib/aspect-ratio';

// プリセット比率
const PRESETS = [
  { label: '16:9 (HD / YouTube)', w: 16, h: 9 },
  { label: '4:3 (古いモニター/写真)', w: 4, h: 3 },
  { label: '1:1 (正方形 / Instagram)', w: 1, h: 1 },
  { label: '21:9 (ウルトラワイド)', w: 21, h: 9 },
  { label: '9:16 (縦型 / TikTok / Reels)', w: 9, h: 16 },
  { label: '黄金比 (1.618 : 1)', w: 1.618, h: 1 },
];

export default function AspectRatio() {
  // モード1: 比率からサイズ算出
  const [ratioW, setRatioW] = useState<number | ''>(16);
  const [ratioH, setRatioH] = useState<number | ''>(9);
  const [sizeW, setSizeW] = useState<number | ''>(1920);
  const [sizeH, setSizeH] = useState<number | ''>(1080);

  // モード2: サイズから比率算出
  const [inputW, setInputW] = useState<number | ''>(1920);
  const [inputH, setInputH] = useState<number | ''>(1080);

  // 比率入力時の変更ハンドラ
  const handleRatioWChange = (val: number | '') => {
    setRatioW(val);
    if (sizeW !== '') {
      const computedH = calculateTargetDimension(sizeW, val, ratioH);
      setSizeH(computedH);
    }
  };

  const handleRatioHChange = (val: number | '') => {
    setRatioH(val);
    if (sizeW !== '') {
      const computedH = calculateTargetDimension(sizeW, ratioW, val);
      setSizeH(computedH);
    }
  };

  // モード1: 幅の変更時の高さ計算
  const handleWidthChange = (val: number | '') => {
    setSizeW(val);
    const computedH = calculateTargetDimension(val, ratioW, ratioH);
    setSizeH(computedH);
  };

  // モード1: 高さの変更時の幅計算
  const handleHeightChange = (val: number | '') => {
    setSizeH(val);
    const computedW = calculateTargetDimension(val, ratioH, ratioW);
    setSizeW(computedW);
  };

  // プリセット適用
  const applyPreset = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    if (sizeW !== '') {
      const computedH = calculateTargetDimension(sizeW, w, h);
      setSizeH(computedH);
    }
  };

  // 選択中のプリセット判定
  const isPresetActive = (w: number, h: number) => ratioW === w && ratioH === h;

  // モード2: 解像度からアスペクト比を約分して計算 (純粋関数呼出し)
  const resultRatio = useMemo(() => {
    return calculateSimplifiedRatio(inputW, inputH);
  }, [inputW, inputH]);

  const resetAll = () => {
    setRatioW(16);
    setRatioH(9);
    setSizeW(1920);
    setSizeH(1080);
    setInputW(1920);
    setInputH(1080);
  };

  const computedSizeText = sizeW && sizeH ? `${sizeW} × ${sizeH}` : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 左側：設定 */}
      <div className="lg:col-span-6 space-y-6">
        {/* モード1：比率からサイズ計算 */}
        <div className="theme-card p-5 bg-card space-y-4">
          <div className="flex justify-between items-center border-b-2 border-border pb-3">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <span>📐</span> 比率からサイズを計算
            </h3>
            <button
              onClick={resetAll}
              className="theme-btn p-1.5 text-[10px] flex items-center gap-1 hover:text-accent"
              aria-label="入力値をリセット"
            >
              <RefreshCw className="w-3 h-3" />
              <span>リセット</span>
            </button>
          </div>

          {/* 比率設定 */}
          <div className="space-y-2">
            <label htmlFor="ratio-w-input" className="text-xs font-extrabold block">
              基準となるアスペクト比
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="ratio-w-input"
                type="number"
                min="0.1"
                step="any"
                placeholder="幅比"
                aria-label="アスペクト比（幅）"
                value={ratioW}
                onChange={(e) => handleRatioWChange(parseNumberInput(e.target.value))}
                className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold text-center focus:outline-none focus:border-accent"
              />
              <span className="font-bold">:</span>
              <input
                id="ratio-h-input"
                type="number"
                min="0.1"
                step="any"
                placeholder="高比"
                aria-label="アスペクト比（高さ）"
                value={ratioH}
                onChange={(e) => handleRatioHChange(parseNumberInput(e.target.value))}
                className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold text-center focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* プリセットボタン */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold text-text/60 block">プリセットを選択</span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const active = isPresetActive(p.w, p.h);
                return (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    title={p.label}
                    aria-pressed={active}
                    className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                      active
                        ? 'border-accent bg-accent text-accent-foreground font-black'
                        : 'border-border bg-card hover:bg-secondary'
                    }`}
                  >
                    {p.w}:{p.h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* サイズ計算 */}
          <div className="space-y-2 pt-3 border-t border-border/10">
            <span className="text-xs font-extrabold block">解像度 / サイズの動的補完</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="size-w-input" className="text-[10px] font-bold text-text/60 block">
                  幅 (Width - px)
                </label>
                <input
                  id="size-w-input"
                  type="number"
                  min="1"
                  placeholder="1920"
                  aria-label="計算サイズ 幅(px)"
                  value={sizeW}
                  onChange={(e) => handleWidthChange(parseNumberInput(e.target.value))}
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-black focus:outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="size-h-input" className="text-[10px] font-bold text-text/60 block">
                  高さ (Height - px)
                </label>
                <input
                  id="size-h-input"
                  type="number"
                  min="1"
                  placeholder="1080"
                  aria-label="計算サイズ 高さ(px)"
                  value={sizeH}
                  onChange={(e) => handleHeightChange(parseNumberInput(e.target.value))}
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-black focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* 結果コピーボタン */}
            {computedSizeText && (
              <div className="pt-2 flex items-center justify-between bg-secondary/50 p-2.5 rounded-lg border border-border">
                <span className="text-[11px] font-bold text-text/70">
                  補完後の解像度:{' '}
                  <span className="font-mono text-text font-black">{computedSizeText}</span>
                </span>
                <CopyButton value={computedSizeText} className="text-xs px-2 py-1" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右側：サイズから比率 ＆ ビジュアルプレビュー */}
      <div className="lg:col-span-6 space-y-6">
        {/* モード2：サイズから比率 */}
        <div className="theme-card p-5 bg-card space-y-4">
          <h3 className="font-extrabold text-sm border-b-2 border-border pb-3 flex items-center gap-1.5">
            <span>🧮</span> サイズから比率（約分）を計算
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="input-w-input" className="text-[10px] font-bold text-text/60 block">
                入力幅 (W)
              </label>
              <input
                id="input-w-input"
                type="number"
                min="1"
                placeholder="例: 1920"
                aria-label="入力幅"
                value={inputW}
                onChange={(e) => setInputW(parseNumberInput(e.target.value))}
                className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="input-h-input" className="text-[10px] font-bold text-text/60 block">
                入力高 (H)
              </label>
              <input
                id="input-h-input"
                type="number"
                min="1"
                placeholder="例: 1080"
                aria-label="入力高"
                value={inputH}
                onChange={(e) => setInputH(parseNumberInput(e.target.value))}
                className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="p-4 bg-secondary rounded-xl border border-border flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-text/70">計算された比率:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-base text-accent">
                {resultRatio || '---'}
              </span>
              {resultRatio && <CopyButton value={resultRatio} className="text-xs px-2 py-1" />}
            </div>
          </div>
        </div>

        {/* ビジュアルプレビュー */}
        <div className="theme-card p-5 bg-[#eaeaea] dark:bg-[#222222] min-h-[220px] flex items-center justify-center relative">
          <span className="absolute top-3 left-3 text-[10px] bg-black text-white px-2 py-0.5 rounded font-black uppercase tracking-widest opacity-60">
            Ratio Visualizer
          </span>

          {ratioW && ratioH && Number(ratioW) > 0 && Number(ratioH) > 0 ? (
            <div
              style={{
                aspectRatio: `${ratioW} / ${ratioH}`,
                maxWidth: '80%',
                maxHeight: '160px',
              }}
              className="w-full theme-card bg-card border-accent shadow-[4px_4px_0px_0px_var(--color-accent)] flex items-center justify-center p-3 text-center transition-all"
            >
              <div className="font-extrabold text-xs">
                <div>
                  {ratioW} : {ratioH}
                </div>
                {sizeW && sizeH && (
                  <div className="text-[10px] text-text/50 font-mono mt-1">
                    {sizeW} × {sizeH}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-text/40 text-xs font-bold">有効な比率を入力してください</div>
          )}
        </div>
      </div>
    </div>
  );
}
