'use client';

import { useState, useMemo } from 'react';
import { Ruler, RefreshCw } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

// プリセット比率
const PRESETS = [
  { label: '16:9 (HD / YouTube)', w: 16, h: 9 },
  { label: '4:3 (古いモニター/写真)', w: 4, h: 3 },
  { label: '1:1 (正方形 / Instagram)', w: 1, h: 1 },
  { label: '21:9 (ウルトラワイド)', w: 21, h: 9 },
  { label: '9:16 (縦型 / TikTok / Reels)', w: 9, h: 16 },
  { label: '黄金比 (1.618 : 1)', w: 1.618, h: 1 },
];

// 最大公約数を計算する関数 (GCD)
const getGcd = (a: number, b: number): number => {
  return b === 0 ? a : getGcd(b, a % b);
};

export default function AspectRatioCalculator() {
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
    if (sizeW !== '' && val && ratioH) {
      const computedH = Math.round((Number(sizeW) * Number(ratioH)) / Number(val));
      setSizeH(computedH);
    }
  };

  const handleRatioHChange = (val: number | '') => {
    setRatioH(val);
    if (sizeW !== '' && ratioW && val) {
      const computedH = Math.round((Number(sizeW) * Number(val)) / Number(ratioW));
      setSizeH(computedH);
    }
  };

  // モード1: 幅の変更時の高さ計算
  const handleWidthChange = (val: number | '') => {
    setSizeW(val);
    if (val === '' || !ratioW || !ratioH) {
      setSizeH('');
      return;
    }
    const computedH = Math.round((val * Number(ratioH)) / Number(ratioW));
    setSizeH(computedH);
  };

  // モード1: 高さの変更時の幅計算
  const handleHeightChange = (val: number | '') => {
    setSizeH(val);
    if (val === '' || !ratioW || !ratioH) {
      setSizeW('');
      return;
    }
    const computedW = Math.round((val * Number(ratioW)) / Number(ratioH));
    setSizeW(computedW);
  };

  // プリセット適用
  const applyPreset = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    if (sizeW !== '') {
      const computedH = Math.round((Number(sizeW) * h) / w);
      setSizeH(computedH);
    }
  };

  // モード2: 解像度からアスペクト比を約分して計算 (useMemoによる派生)
  const resultRatio = useMemo(() => {
    if (!inputW || !inputH) {
      return '';
    }

    const w = Number(inputW);
    const h = Number(inputH);

    if (w <= 0 || h <= 0) {
      return '';
    }

    // 小数の場合は単純なGCDが使えないため整数にする
    const factor = 1000;
    const intW = Math.round(w * factor);
    const intH = Math.round(h * factor);
    const gcd = getGcd(intW, intH);

    const simpleW = Math.round((intW / gcd) * 1000) / 1000;
    const simpleH = Math.round((intH / gcd) * 1000) / 1000;

    // 黄金比などの近似判定（綺麗に割り切れない場合）
    if (simpleW > 100 || simpleH > 100) {
      const floatRatio = (w / h).toFixed(3);
      return `${floatRatio} : 1 (約 ${Math.round(w / h)}:${Math.round(h / h)})`;
    }
    return `${simpleW} : ${simpleH}`;
  }, [inputW, inputH]);

  const resetAll = () => {
    setRatioW(16);
    setRatioH(9);
    setSizeW(1920);
    setSizeH(1080);
    setInputW(1920);
    setInputH(1080);
  };

  return (
    <ToolPageLayout
      title="Aspect Ratio Calculator"
      description="Webデザインや画像のリサイズ、動画のエンコードなどで使用するアスペクト比を計算します。特定の比率に合わせたサイズ計算と、解像度から比率を割り出す約分計算の両方に対応しています。"
      icon={Ruler}
    >
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
              >
                <RefreshCw className="w-3 h-3" />
                <span>リセット</span>
              </button>
            </div>

            {/* 比率設定 */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold block">基準となるアスペクト比</span>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  placeholder="幅比"
                  value={ratioW}
                  onChange={(e) =>
                    handleRatioWChange(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold text-center focus:outline-none"
                />
                <span className="font-bold">:</span>
                <input
                  type="number"
                  placeholder="高比"
                  value={ratioH}
                  onChange={(e) =>
                    handleRatioHChange(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold text-center focus:outline-none"
                />
              </div>
            </div>

            {/* プリセットボタン */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-text/60 block">
                プリセットを選択
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.w, p.h)}
                    className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
                  >
                    {p.w}:{p.h}
                  </button>
                ))}
              </div>
            </div>

            {/* サイズ計算 */}
            <div className="space-y-2 pt-3 border-t border-border/10">
              <span className="text-xs font-extrabold block">解像度 / サイズの動的補完</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text/60">幅 (Width - px)</span>
                  <input
                    type="number"
                    value={sizeW}
                    onChange={(e) =>
                      handleWidthChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-black focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-text/60">高さ (Height - px)</span>
                  <input
                    type="number"
                    value={sizeH}
                    onChange={(e) =>
                      handleHeightChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-black focus:outline-none"
                  />
                </div>
              </div>
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
                <span className="text-[10px] font-bold text-text/60">入力幅 (W)</span>
                <input
                  type="number"
                  placeholder="例: 1920"
                  value={inputW}
                  onChange={(e) => setInputW(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-text/60">入力高 (H)</span>
                <input
                  type="number"
                  placeholder="例: 1080"
                  value={inputH}
                  onChange={(e) => setInputH(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full border-2 border-border p-2 rounded-lg bg-card text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-xl border border-border flex items-center justify-between">
              <span className="text-xs font-bold text-text/70">計算された比率:</span>
              <span className="font-mono font-black text-base text-accent">
                {resultRatio || '---'}
              </span>
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
    </ToolPageLayout>
  );
}
