// src/components/tools/css/CubicBezier.tsx
'use client';

import { useState, useMemo } from 'react';
import { Play, RefreshCw } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';

// イージングプリセット定義
const PRESETS = [
  { name: 'ease', value: [0.25, 0.1, 0.25, 1], label: '標準 (ease)' },
  { name: 'linear', value: [0, 0, 1, 1], label: '等速 (linear)' },
  { name: 'ease-in', value: [0.42, 0, 1, 1], label: '加速 (ease-in)' },
  { name: 'ease-out', value: [0, 0, 0.58, 1], label: '減速 (ease-out)' },
  { name: 'ease-in-out', value: [0.42, 0, 0.58, 1], label: '加減速 (ease-in-out)' },
  { name: 'ease-in-back', value: [0.6, -0.28, 0.735, 0.045], label: '後退から加速 (ease-in-back)' },
  {
    name: 'ease-out-back',
    value: [0.175, 0.885, 0.32, 1.275],
    label: '超過から減速 (ease-out-back)',
  },
];

export default function CubicBezier() {
  const [x1, setX1] = useState(0.25);
  const [y1, setY1] = useState(0.1);
  const [x2, setX2] = useState(0.25);
  const [y2, setY2] = useState(1.0);

  const [comparePreset, setComparePreset] = useState('linear');
  const [isAnimating, setIsAnimating] = useState(false);

  // 比較対象のイージング値を取得
  const compareValue = useMemo(() => {
    const preset = PRESETS.find((p) => p.name === comparePreset);
    return preset ? preset.value : [0, 0, 1, 1];
  }, [comparePreset]);

  // アニメーション実行トリガー
  const triggerAnimation = () => {
    setIsAnimating(false);
    // Reactの再描画を待ってからアニメーションクラスを再付与
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  };

  const transitionCode = `transition: all 1.0s cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)});`;

  const applyPreset = (vals: number[]) => {
    setX1(vals[0]);
    setY1(vals[1]);
    setX2(vals[2]);
    setY2(vals[3]);
  };

  const resetAll = () => {
    setX1(0.25);
    setY1(0.1);
    setX2(0.25);
    setY2(1.0);
    setComparePreset('linear');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 左側：設定とグラフ */}
      <div className="lg:col-span-6 space-y-6">
        <div className="theme-card p-5 bg-card space-y-5 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex justify-between items-center border-b-2 border-border pb-3">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-text">
              <span>📈</span> ベジェ曲線グラフ
            </h3>
            <button
              onClick={resetAll}
              className="theme-btn p-1.5 text-[10px] flex items-center gap-1 hover:text-accent shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>リセット</span>
            </button>
          </div>

          {/* SVGベジェ曲線プロッター */}
          <div className="flex justify-center p-4 bg-secondary rounded-2xl border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
            <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
              {/* グリッドガイド */}
              <rect
                x="0"
                y="50"
                width="200"
                height="100"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="150"
                x2="200"
                y2="150"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <line
                x1="0"
                y1="50"
                x2="200"
                y2="50"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />

              {/* スタートとエンドの補助点 */}
              <circle cx="0" cy="150" r="4" fill="var(--color-text)" />
              <circle cx="200" cy="50" r="4" fill="var(--color-text)" />

              {/* ベジェハンドル線 */}
              <line
                x1="0"
                y1="150"
                x2={x1 * 200}
                y2={150 - y1 * 100}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="1.5"
              />
              <line
                x1="200"
                y1="50"
                x2={x2 * 200}
                y2={150 - y2 * 100}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="1.5"
              />

              {/* ハンドルポイント */}
              <circle
                cx={x1 * 200}
                cy={150 - y1 * 100}
                r="6"
                fill="#10b981"
                stroke="var(--color-text)"
                strokeWidth="1.5"
                className="cursor-pointer"
              />
              <circle
                cx={x2 * 200}
                cy={150 - y2 * 100}
                r="6"
                fill="#8b5cf6"
                stroke="var(--color-text)"
                strokeWidth="1.5"
                className="cursor-pointer"
              />

              {/* メインベジェ曲線 */}
              <path
                d={`M 0 150 C ${x1 * 200} ${150 - y1 * 100}, ${x2 * 200} ${150 - y2 * 100}, 200 50`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3.5"
              />
            </svg>
          </div>

          {/* スライダーコントロール */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-500 block">
                  P1: X1 = {x1.toFixed(2)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={x1}
                  onChange={(e) => setX1(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-secondary rounded-lg h-2"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-500 block">
                  P1: Y1 = {y1.toFixed(2)}
                </span>
                <input
                  type="range"
                  min="-0.5"
                  max="1.5"
                  step="0.01"
                  value={y1}
                  onChange={(e) => setY1(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-secondary rounded-lg h-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-purple-500 block">
                  P2: X2 = {x2.toFixed(2)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={x2}
                  onChange={(e) => setX2(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-secondary rounded-lg h-2"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-purple-500 block">
                  P2: Y2 = {y2.toFixed(2)}
                </span>
                <input
                  type="range"
                  min="-0.5"
                  max="1.5"
                  step="0.01"
                  value={y2}
                  onChange={(e) => setY2(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-secondary rounded-lg h-2"
                />
              </div>
            </div>
          </div>

          {/* プリセット */}
          <div className="space-y-2 pt-2 border-t border-border/15">
            <span className="text-xs font-extrabold block text-text">イージングプリセット</span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.value)}
                  className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-border bg-card hover:bg-secondary transition-colors cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 右側：アニメーション ＆ コード */}
      <div className="lg:col-span-6 space-y-6">
        {/* アニメーションプレビュー */}
        <div className="theme-card p-5 bg-card space-y-4 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex justify-between items-center border-b-2 border-border pb-3">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-text">
              <span>🏃</span> プレビュー比較
            </h3>
            <button
              onClick={triggerAnimation}
              className="theme-btn bg-accent text-white px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_var(--border)]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>再生する</span>
            </button>
          </div>

          {/* アニメーションステージ */}
          <div className="p-4 bg-secondary rounded-2xl border-2 border-border space-y-5 relative overflow-hidden h-[180px] flex flex-col justify-center shadow-[2px_2px_0px_0px_var(--border)]">
            {/* カスタムイージング */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-black text-text/60">
                <span>カスタム (cubic-bezier)</span>
              </div>
              <div className="w-full h-8 bg-card rounded border border-border/20 relative">
                <div
                  style={{
                    transition: isAnimating
                      ? `transform 1s cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
                      : 'none',
                    transform: isAnimating ? 'translateX(calc(100% - 24px))' : 'translateX(0)',
                  }}
                  className="w-6 h-6 bg-accent rounded border-2 border-border absolute left-0 top-1 transition-transform"
                />
              </div>
            </div>

            {/* 比較用プリセット */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-black text-text/60">
                <span>比較対象</span>
                <select
                  value={comparePreset}
                  onChange={(e) => {
                    setComparePreset(e.target.value);
                    setIsAnimating(false);
                  }}
                  className="border-2 border-border p-1 rounded-lg bg-card text-[9px] font-bold focus:outline-none"
                >
                  {PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full h-8 bg-card rounded border border-border/20 relative">
                <div
                  style={{
                    transition: isAnimating
                      ? `transform 1s cubic-bezier(${compareValue[0]}, ${compareValue[1]}, ${compareValue[2]}, ${compareValue[3]})`
                      : 'none',
                    transform: isAnimating ? 'translateX(calc(100% - 24px))' : 'translateX(0)',
                  }}
                  className="w-6 h-6 bg-purple-500 rounded border-2 border-border absolute left-0 top-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>

        {/* コード出力 */}
        <div className="theme-card p-5 bg-card space-y-3 border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
          <div className="flex justify-between items-center border-b-2 border-border pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text/60">
              CSS Transition コード
            </h4>
            <CopyButton
              value={transitionCode}
              label="コピー"
              copiedLabel="コピー済"
              className="theme-btn p-1.5 text-[10px] flex items-center gap-1 cursor-pointer shadow-[1.5px_1.5px_0px_0px_var(--border)]"
            />
          </div>
          <pre className="p-3 bg-[#1e1e1e] text-[#f8f8f2] font-mono text-[10px] rounded-lg border-2 border-border overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
            {`transition: all 1.0s cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)});`}
          </pre>
        </div>
      </div>
    </div>
  );
}
