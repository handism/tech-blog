'use client';

import { useState, useMemo, useCallback } from 'react';
import { Sliders, Copy, Download, RefreshCw, Layers, Sparkles, Check } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

// 簡易乱数ジェネレータ（シードベース）
function createRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function SvgWaveBlobGenerator() {
  const [mode, setMode] = useState<'blob' | 'wave'>('blob');
  const [seed, setSeed] = useState<number>(42);
  const { copied, copy } = useCopyToClipboard();

  // Blob設定
  const [blobEdges, setBlobEdges] = useState(6);
  const [blobGrowth, setBlobGrowth] = useState(40); // うねりの大きさ (0-100)
  const blobSize = 400;
  const [blobColor1, setBlobColor1] = useState('#10b981'); // Emerald
  const [blobColor2, setBlobColor2] = useState('#3b82f6'); // Blue
  const [useBlobGradient, setUseBlobGradient] = useState(true);
  const [animateBlob, setAnimateBlob] = useState(true);
  const [blobAnimSpeed, setBlobAnimSpeed] = useState(8); // 秒数

  // Wave設定
  const [waveLayers, setWaveLayers] = useState(3);
  const [waveCount, setWaveCount] = useState(3); // 波の数 (1-10)
  const [waveHeight, setWaveHeight] = useState(150); // 波の高さ (50-350)
  const [waveGrowth, setWaveGrowth] = useState(60); // うねり幅 (10-150)
  const [waveColor1, setWaveColor1] = useState('#10b981');
  const [waveColor2, setWaveColor2] = useState('#0ea5e9'); // Ocean
  const [useWaveGradient, setUseWaveGradient] = useState(true);
  const [animateWave, setAnimateWave] = useState(true);
  const [waveAnimSpeed, setWaveAnimSpeed] = useState(10);

  // シード変更
  const randomize = () => {
    setSeed(Math.floor(Math.random() * 10000));
  };

  // --- Blobのパス生成ロジック ---
  const generateBlobPoints = (edges: number, growth: number, size: number, seedVal: number) => {
    const rand = createRandom(seedVal);
    const center = size / 2;
    // 基本半径 (sizeの30%〜45%程度)
    const baseRadius = size * 0.35;
    // 成長率に応じた最大変動幅 (成長率100%で基本半径の70%)
    const maxDelta = baseRadius * (growth / 100) * 0.7;

    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < edges; i++) {
      const angle = (i * 2 * Math.PI) / edges;
      const radius = baseRadius + (rand() - 0.5) * maxDelta;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push({ x, y });
    }

    return points;
  };

  // 点を繋ぐベジェ曲線パスを作成
  const getBlobPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const l = points.length;
    let d = '';

    // 隣り合う点の中間点を計算し、中間点同士を2次ベジェ（制御点を元の頂点）で結ぶ
    // 閉じた滑らかなパスが確実に得られます
    const midPoints = points.map((p, idx) => {
      const nextP = points[(idx + 1) % l];
      return {
        x: (p.x + nextP.x) / 2,
        y: (p.y + nextP.y) / 2,
      };
    });

    // M [最初の中間点]
    d += `M ${midPoints[l - 1].x.toFixed(1)},${midPoints[l - 1].y.toFixed(1)}`;

    for (let i = 0; i < l; i++) {
      const control = points[i];
      const target = midPoints[i];
      d += ` Q ${control.x.toFixed(1)},${control.y.toFixed(1)} ${target.x.toFixed(1)},${target.y.toFixed(1)}`;
    }

    d += ' Z';
    return d;
  };

  // アニメーション用（モーフィング）の別パスを生成
  const blobPath1 = useMemo(() => {
    const pts = generateBlobPoints(blobEdges, blobGrowth, blobSize, seed);
    return getBlobPath(pts);
  }, [blobEdges, blobGrowth, blobSize, seed]);

  const blobPath2 = useMemo(() => {
    // 異なるシードでモーフィング先を生成
    const pts = generateBlobPoints(blobEdges, blobGrowth, blobSize, seed + 123);
    return getBlobPath(pts);
  }, [blobEdges, blobGrowth, blobSize, seed]);

  // --- Waveのパス生成ロジック ---
  const generateWavePath = useCallback(
    (
      layerIndex: number,
      w: number,
      h: number,
      waves: number,
      height: number,
      growth: number,
      seedVal: number
    ) => {
      // レイヤーごとおよびシードごとに乱数設定
      const rand = createRandom(seedVal + layerIndex * 10);
      const pointsCount = waves * 2 + 1;
      const segmentWidth = w / (pointsCount - 1);

      // 基本となるY座標（下部からの高さ）
      // レイヤーごとに高さを少しずらす
      const baseHeightY = h - (height - (layerIndex * height) / (waveLayers + 1));

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < pointsCount; i++) {
        const x = i * segmentWidth;
        // サイン波のような基本的なうねりにランダムを付加
        const randomOffset = (rand() - 0.5) * growth;
        const sinOffset = Math.sin((i / (pointsCount - 1)) * Math.PI * waves) * (growth * 0.5);
        const y = baseHeightY + randomOffset + sinOffset;
        points.push({ x, y });
      }

      let d = `M 0,${h} L 0,${points[0].y.toFixed(1)}`;

      // 中間点法で滑らかな波を生成
      const l = points.length;
      for (let i = 0; i < l - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        d += ` Q ${p1.x.toFixed(1)},${p1.y.toFixed(1)} ${xc.toFixed(1)},${yc.toFixed(1)}`;
      }
      // 最後の点へ繋ぐ
      d += ` Q ${points[l - 1].x.toFixed(1)},${points[l - 1].y.toFixed(1)} ${points[l - 1].x.toFixed(1)},${points[l - 1].y.toFixed(1)}`;

      // 右下から左下を通って閉じる
      d += ` L ${w},${h} Z`;
      return d;
    },
    [waveLayers]
  );

  // 各レイヤーのWaveパス（静的およびアニメーション用）
  const waveLayersData = useMemo(() => {
    const layers = [];
    const w = 800;
    const h = 400;
    for (let i = 0; i < waveLayers; i++) {
      const d1 = generateWavePath(i, w, h, waveCount, waveHeight, waveGrowth, seed);
      const d2 = generateWavePath(i, w, h, waveCount, waveHeight, waveGrowth, seed + 456);
      layers.push({ d1, d2 });
    }
    return layers;
  }, [waveLayers, waveCount, waveHeight, waveGrowth, seed, generateWavePath]);

  // --- SVGコード文字列の構築 ---
  const svgString = useMemo(() => {
    if (mode === 'blob') {
      const gradient = useBlobGradient
        ? `  <defs>
    <linearGradient id="blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${blobColor1}" />
      <stop offset="100%" stop-color="${blobColor2}" />
    </linearGradient>
  </defs>`
        : '';

      const fillColor = useBlobGradient ? 'url(#blob-grad)' : blobColor1;

      const pathContent = animateBlob
        ? `    <path fill="${fillColor}" d="${blobPath1}">
      <animate attributeName="d" dur="${blobAnimSpeed}s" repeatCount="indefinite" values="${blobPath1}; ${blobPath2}; ${blobPath1}" />
    </path>`
        : `    <path fill="${fillColor}" d="${blobPath1}" />`;

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${blobSize} ${blobSize}" width="100%" height="100%">
${gradient}
  <g>
${pathContent}
  </g>
</svg>`;
    } else {
      const w = 800;
      const h = 400;

      const gradients = useWaveGradient
        ? `  <defs>
    <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${waveColor1}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${waveColor2}" stop-opacity="0.9" />
    </linearGradient>
  </defs>`
        : '';

      const baseColor = useWaveGradient ? 'url(#wave-grad)' : waveColor1;

      const paths = waveLayersData
        .map((data, idx) => {
          const opacity = (1 - idx * 0.2).toFixed(2);
          const speed = (waveAnimSpeed * (1 + idx * 0.25)).toFixed(1);

          if (animateWave) {
            return `    <path fill="${baseColor}" fill-opacity="${opacity}" d="${data.d1}">
      <animate attributeName="d" dur="${speed}s" repeatCount="indefinite" values="${data.d1}; ${data.d2}; ${data.d1}" />
    </path>`;
          }
          return `    <path fill="${baseColor}" fill-opacity="${opacity}" d="${data.d1}" />`;
        })
        .join('\n');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="100%">
${gradients}
  <g>
${paths}
  </g>
</svg>`;
    }
  }, [
    mode,
    blobSize,
    blobColor1,
    blobColor2,
    useBlobGradient,
    blobPath1,
    blobPath2,
    animateBlob,
    blobAnimSpeed,
    waveLayersData,
    waveColor1,
    waveColor2,
    useWaveGradient,
    animateWave,
    waveAnimSpeed,
  ]);

  // コピー
  const handleCopy = () => {
    copy(svgString);
  };

  // ダウンロード
  const handleDownload = () => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode}-${seed}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      title="SVG Wave & Blob Generator"
      description="Webデザインに使える滑らかなアメーバ状シェイプ（Blob）や、重ね合わせて使える美しい波形（Wave）を生成します。SMILによる完全ブラウザネイティブなモーフィングアニメーションに対応しています。"
      icon={Sparkles}
    >
      {/* モード選択タブ */}
      <div className="flex border-b-2 border-border mb-6">
        <button
          onClick={() => setMode('blob')}
          className={`px-6 py-3 font-extrabold text-sm border-b-4 -mb-[2px] transition-all ${
            mode === 'blob' ? 'border-accent text-accent' : 'border-transparent text-text/60'
          }`}
        >
          🔮 Blob (アメーバ)
        </button>
        <button
          onClick={() => setMode('wave')}
          className={`px-6 py-3 font-extrabold text-sm border-b-4 -mb-[2px] transition-all ${
            mode === 'wave' ? 'border-accent text-accent' : 'border-transparent text-text/60'
          }`}
        >
          🌊 Wave (波形)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：プレビュー ＆ 出力 */}
        <div className="lg:col-span-7 space-y-6">
          {/* SVG ライブプレビューコンテナ */}
          <div className="theme-card bg-secondary/30 dark:bg-card/20 p-6 min-h-[350px] flex items-center justify-center relative overflow-hidden border-2 border-border">
            <span className="absolute top-3 left-3 text-[10px] bg-black text-white px-2 py-0.5 rounded font-black uppercase tracking-widest opacity-60">
              Live Preview
            </span>
            <button
              onClick={randomize}
              className="absolute top-2 right-2 theme-btn p-2 rounded-xl text-xs flex items-center gap-1 hover:text-accent"
              title="ランダム再生成"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div
              className="w-full max-w-[320px] aspect-square flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgString }}
            />
          </div>

          {/* 出力コードエリア */}
          <div className="theme-card p-4 space-y-3 bg-card border-2 border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold">SVG Source Code</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="theme-btn px-3 py-1.5 text-xs flex items-center gap-1.5"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? 'コピーしました' : 'コードをコピー'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="theme-btn px-3 py-1.5 text-xs bg-accent text-white flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>SVGダウンロード</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={svgString}
              className="w-full h-32 p-3 font-mono text-[10px] border-2 border-border rounded-lg bg-secondary text-text resize-none focus:outline-none"
            />
          </div>
        </div>

        {/* 右側：コントロールパネル */}
        <div className="lg:col-span-5 space-y-6">
          <div className="theme-card p-5 bg-card space-y-5 border-2 border-border">
            <h3 className="font-extrabold text-sm border-b-2 border-border pb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>カスタマイズパラメータ</span>
            </h3>

            {mode === 'blob' ? (
              // --- Blobの設定コントロール ---
              <div className="space-y-4 text-xs font-bold">
                {/* 頂点数 / Edges */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>頂点の複雑さ (Edges)</span>
                    <span className="text-accent">{blobEdges}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="1"
                    value={blobEdges}
                    onChange={(e) => setBlobEdges(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* うねり強度 / Growth */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>うねり度合い (Growth)</span>
                    <span className="text-accent">{blobGrowth}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={blobGrowth}
                    onChange={(e) => setBlobGrowth(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* グラデーション切替 */}
                <div className="flex items-center justify-between py-2 border-y border-border/10">
                  <span>グラデーションを使用</span>
                  <input
                    type="checkbox"
                    checked={useBlobGradient}
                    onChange={(e) => setUseBlobGradient(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-accent cursor-pointer"
                  />
                </div>

                {/* カラーピッカー */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span>カラー1</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={blobColor1}
                        onChange={(e) => setBlobColor1(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-2 border-border"
                      />
                      <input
                        type="text"
                        value={blobColor1}
                        onChange={(e) => setBlobColor1(e.target.value)}
                        className="w-full text-[10px] border border-border rounded px-1.5 py-1 text-center font-mono bg-card"
                      />
                    </div>
                  </div>
                  {useBlobGradient && (
                    <div className="space-y-1">
                      <span>カラー2</span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={blobColor2}
                          onChange={(e) => setBlobColor2(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-2 border-border"
                        />
                        <input
                          type="text"
                          value={blobColor2}
                          onChange={(e) => setBlobColor2(e.target.value)}
                          className="w-full text-[10px] border border-border rounded px-1.5 py-1 text-center font-mono bg-card"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* アニメーション設定 */}
                <div className="space-y-4 pt-3 border-t border-border/10">
                  <div className="flex items-center justify-between">
                    <span>モーフィングアニメーション</span>
                    <input
                      type="checkbox"
                      checked={animateBlob}
                      onChange={(e) => setAnimateBlob(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-accent cursor-pointer"
                    />
                  </div>

                  {animateBlob && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>アニメーション速度 (秒/ループ)</span>
                        <span className="text-accent">{blobAnimSpeed}s</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={blobAnimSpeed}
                        onChange={(e) => setBlobAnimSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // --- Waveの設定コントロール ---
              <div className="space-y-4 text-xs font-bold">
                {/* レイヤー数 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" /> 波のレイヤー数
                    </span>
                    <span className="text-accent">{waveLayers}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={waveLayers}
                    onChange={(e) => setWaveLayers(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* うねり周期数 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>波の頻度 (周期)</span>
                    <span className="text-accent">{waveCount}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={waveCount}
                    onChange={(e) => setWaveCount(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* 波の高さ */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>ベースの高さ (Height)</span>
                    <span className="text-accent">{waveHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="320"
                    step="10"
                    value={waveHeight}
                    onChange={(e) => setWaveHeight(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* うねり幅 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>波の振幅 (Growth)</span>
                    <span className="text-accent">{waveGrowth}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={waveGrowth}
                    onChange={(e) => setWaveGrowth(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* グラデーション */}
                <div className="flex items-center justify-between py-2 border-y border-border/10">
                  <span>グラデーションを使用</span>
                  <input
                    type="checkbox"
                    checked={useWaveGradient}
                    onChange={(e) => setUseWaveGradient(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-accent cursor-pointer"
                  />
                </div>

                {/* カラーピッカー */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span>カラー1</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={waveColor1}
                        onChange={(e) => setWaveColor1(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-2 border-border"
                      />
                      <input
                        type="text"
                        value={waveColor1}
                        onChange={(e) => setWaveColor1(e.target.value)}
                        className="w-full text-[10px] border border-border rounded px-1.5 py-1 text-center font-mono bg-card"
                      />
                    </div>
                  </div>
                  {useWaveGradient && (
                    <div className="space-y-1">
                      <span>カラー2</span>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={waveColor2}
                          onChange={(e) => setWaveColor2(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border-2 border-border"
                        />
                        <input
                          type="text"
                          value={waveColor2}
                          onChange={(e) => setWaveColor2(e.target.value)}
                          className="w-full text-[10px] border border-border rounded px-1.5 py-1 text-center font-mono bg-card"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* アニメーション */}
                <div className="space-y-4 pt-3 border-t border-border/10">
                  <div className="flex items-center justify-between">
                    <span>波をうねらせる (アニメーション)</span>
                    <input
                      type="checkbox"
                      checked={animateWave}
                      onChange={(e) => setAnimateWave(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 accent-accent cursor-pointer"
                    />
                  </div>

                  {animateWave && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span>アニメーション周期 (秒)</span>
                        <span className="text-accent">{waveAnimSpeed}s</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={waveAnimSpeed}
                        onChange={(e) => setWaveAnimSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
