// src/components/tools/css/CssGradient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
} from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface ColorStop {
  id: string;
  color: string;
  position: number; // 0 - 100
}

interface MeshPoint {
  id: string;
  color: string;
  x: number; // 0 - 100
  y: number; // 0 - 100
  radius: number; // 10 - 100
  opacity: number; // 0 - 1
}

export default function CssGradient() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'mesh'>('linear');
  const { copy } = useCopyToClipboard();
  const [copiedType, setCopiedType] = useState<string>('');
  const [isAppliedToSite, setIsAppliedToSite] = useState<boolean>(false);
  const originalBackgroundRef = useRef<string>('');

  // Linear & Radial 共用カラーポイント
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: '1', color: '#ff007f', position: 0 },
    { id: '2', color: '#764ba2', position: 50 },
    { id: '3', color: '#00ffff', position: 100 },
  ]);

  // Linear 設定
  const [angle, setAngle] = useState<number>(135);

  // Radial 設定
  const [shape, setShape] = useState<'circle' | 'ellipse'>('circle');
  const [posX, setPosX] = useState<number>(50);
  const [posY, setPosY] = useState<number>(50);

  // Mesh 設定
  const [meshPoints, setMeshPoints] = useState<MeshPoint[]>([
    { id: 'm1', color: '#ff007f', x: 20, y: 30, radius: 60, opacity: 0.6 },
    { id: 'm2', color: '#764ba2', x: 80, y: 20, radius: 50, opacity: 0.7 },
    { id: 'm3', color: '#00ffff', x: 30, y: 80, radius: 70, opacity: 0.5 },
    { id: 'm4', color: '#ffaa00', x: 70, y: 70, radius: 50, opacity: 0.6 },
  ]);
  const [activeMeshPointId, setActiveMeshPointId] = useState<string>('m1');
  const meshContainerRef = useRef<HTMLDivElement>(null);
  const draggingPointIdRef = useRef<string | null>(null);

  // ページ離脱時に元の背景を復元
  useEffect(() => {
    return () => {
      if (originalBackgroundRef.current !== undefined) {
        document.documentElement.style.backgroundImage = originalBackgroundRef.current;
      }
    };
  }, []);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  };

  // CSS グラデーションコードの生成
  const generateCssCode = () => {
    if (gradientType === 'linear') {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
      const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else if (gradientType === 'radial') {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position);
      const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');
      return `radial-gradient(${shape} at ${posX}% ${posY}%, ${stopsStr})`;
    } else {
      // Mesh: 複数の radial-gradient の重ね合わせ
      return meshPoints
        .map((p) => {
          const rgba = hexToRgba(p.color, p.opacity);
          return `radial-gradient(circle at ${p.x}% ${p.y}%, ${rgba} 0%, transparent ${p.radius}%)`;
        })
        .join(',\n  ');
    }
  };

  const cssValue = generateCssCode();
  const fullCssDeclaration = `background-image: ${cssValue.replace(/\n  /g, ' ')};`;

  // 各種フォーマットでコピー
  const handleCopy = (text: string, type: string) => {
    copy(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType('');
    }, 2000);
  };

  // カラーストップの追加
  const addColorStop = () => {
    if (colorStops.length >= 10) return;
    const newPosition = Math.min(
      100,
      Math.max(0, Math.round(colorStops[colorStops.length - 1].position / 2 + 50))
    );
    const newStop: ColorStop = {
      id: Math.random().toString(36).substring(2, 9),
      color:
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0'),
      position: newPosition,
    };
    setColorStops([...colorStops, newStop]);
  };

  // カラーストップの削除
  const removeColorStop = (id: string) => {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((s) => s.id !== id));
  };

  const updateColorStop = (id: string, fields: Partial<ColorStop>) => {
    setColorStops(colorStops.map((s) => (s.id === id ? { ...s, ...fields } : s)));
  };

  // メッシュポイントの追加
  const addMeshPoint = () => {
    if (meshPoints.length >= 8) return;
    const newPoint: MeshPoint = {
      id: Math.random().toString(36).substring(2, 9),
      color:
        '#' +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0'),
      x: Math.round(20 + Math.random() * 60),
      y: Math.round(20 + Math.random() * 60),
      radius: 60,
      opacity: 0.6,
    };
    setMeshPoints([...meshPoints, newPoint]);
    setActiveMeshPointId(newPoint.id);
  };

  // メッシュポイントの削除
  const removeMeshPoint = (id: string) => {
    if (meshPoints.length <= 1) return;
    const nextPoints = meshPoints.filter((p) => p.id !== id);
    setMeshPoints(nextPoints);
    if (activeMeshPointId === id) {
      setActiveMeshPointId(nextPoints[0].id);
    }
  };

  const updateMeshPoint = (id: string, fields: Partial<MeshPoint>) => {
    setMeshPoints(meshPoints.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  };

  // サイト全体へのプレビュー適用
  const toggleSitePreview = () => {
    if (isAppliedToSite) {
      document.documentElement.style.backgroundImage = originalBackgroundRef.current;
      setIsAppliedToSite(false);
    } else {
      originalBackgroundRef.current = document.documentElement.style.backgroundImage || '';
      document.documentElement.style.backgroundImage = cssValue.replace(/\n  /g, ' ');
      setIsAppliedToSite(true);
    }
  };

  // メッシュポイントのドラッグハンドラ
  const handleMeshMouseDown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    draggingPointIdRef.current = id;
    setActiveMeshPointId(id);
    window.addEventListener('mousemove', handleMeshMouseMove);
    window.addEventListener('mouseup', handleMeshMouseUp);
  };

  const handleMeshMouseMove = (e: MouseEvent) => {
    if (!draggingPointIdRef.current || !meshContainerRef.current) return;
    const rect = meshContainerRef.current.getBoundingClientRect();

    // コンテナ内の相対座標 (0 - 100%)
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    // クランプ処理
    x = Math.max(0, Math.min(100, Math.round(x)));
    y = Math.max(0, Math.min(100, Math.round(y)));

    updateMeshPoint(draggingPointIdRef.current, { x, y });
  };

  const handleMeshMouseUp = () => {
    draggingPointIdRef.current = null;
    window.removeEventListener('mousemove', handleMeshMouseMove);
    window.removeEventListener('mouseup', handleMeshMouseUp);
  };

  // Canvas を使用した PNG ダウンロード
  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (gradientType === 'linear') {
      const angleRad = (angle * Math.PI) / 180;
      const width = canvas.width;
      const height = canvas.height;

      const length = Math.abs(width * Math.sin(angleRad)) + Math.abs(height * Math.cos(angleRad));
      const halfLength = length / 2;

      const cx = width / 2;
      const cy = height / 2;

      const x0 = cx - Math.cos(angleRad - Math.PI / 2) * halfLength;
      const y0 = cy - Math.sin(angleRad - Math.PI / 2) * halfLength;
      const x1 = cx + Math.cos(angleRad - Math.PI / 2) * halfLength;
      const y1 = cy + Math.sin(angleRad - Math.PI / 2) * halfLength;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      colorStops.forEach((s) => {
        grad.addColorStop(s.position / 100, s.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (gradientType === 'radial') {
      const width = canvas.width;
      const height = canvas.height;
      const cx = (posX / 100) * width;
      const cy = (posY / 100) * height;

      const maxDist = Math.max(cx, width - cx, cy, height - cy);
      const r1 = shape === 'circle' ? maxDist : maxDist * 1.5;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
      colorStops.forEach((s) => {
        grad.addColorStop(s.position / 100, s.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, width, height);

      meshPoints.forEach((p) => {
        const px = (p.x / 100) * width;
        const py = (p.y / 100) * height;
        const radius = (p.radius / 100) * Math.max(width, height);

        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        grad.addColorStop(0, hexToRgba(p.color, p.opacity));
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });
    }

    const link = document.createElement('a');
    link.download = `gradient-${gradientType}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const activePoint = meshPoints.find((p) => p.id === activeMeshPointId) || meshPoints[0];

  return (
    <div className="space-y-6">
      {/* サイトプレビュー適用時の通知バナー */}
      {isAppliedToSite && (
        <div className="bg-accent/15 border-2 border-accent text-text p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm animate-pulse mb-4">
          <span>
            ✨ 現在、作成したグラデーションをサイト全体の背景として適用（プレビュー中）しています。
          </span>
          <button
            onClick={toggleSitePreview}
            className="px-3.5 py-1.5 bg-accent text-white rounded-xl hover:opacity-90 flex items-center gap-1 cursor-pointer transition-all"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>プレビュー解除</span>
          </button>
        </div>
      )}

      {/* グラデーション形式切り替え */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-secondary/40 border-2 border-border rounded-2xl">
          {(['linear', 'radial', 'mesh'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setGradientType(type);
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black capitalize transition-all cursor-pointer ${
                gradientType === type
                  ? 'bg-accent text-white shadow-[2px_2px_0px_0px_var(--border)]'
                  : 'text-text/70 hover:text-text'
              }`}
            >
              {type === 'linear'
                ? '線形 (Linear)'
                : type === 'radial'
                  ? '放射状 (Radial)'
                  : 'メッシュ (Mesh)'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側：プレビュー領域 & コード出力 (7列) */}
        <div className="lg:col-span-7 space-y-6">
          {/* メインプレビューコンテナ */}
          <div
            ref={meshContainerRef}
            className="border-3 border-border rounded-3xl min-h-[380px] shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden flex items-center justify-center bg-slate-950"
            style={{
              backgroundImage: gradientType === 'mesh' ? undefined : cssValue,
            }}
          >
            {/* メッシュグラデーション専用レイヤー */}
            {gradientType === 'mesh' && (
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{ backgroundImage: cssValue }}
              />
            )}

            {/* メッシュ配置調整用ドラッグアンカー */}
            {gradientType === 'mesh' &&
              meshPoints.map((p) => (
                <div
                  key={p.id}
                  onMouseDown={(e) => handleMeshMouseDown(p.id, e)}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-3 flex items-center justify-center cursor-move shadow-md group transition-transform ${
                    activeMeshPointId === p.id
                      ? 'border-white bg-accent scale-110 z-20'
                      : 'border-white/50 bg-secondary/80 hover:scale-105 z-10'
                  }`}
                  title="ドラッグして位置調整"
                >
                  <Move
                    className={`w-3.5 h-3.5 ${activeMeshPointId === p.id ? 'text-white' : 'text-text/60'}`}
                  />
                  {/* カラーツールチップ */}
                  <span className="absolute bottom-9 bg-card border border-border px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.color} ({p.x}%, {p.y}%)
                  </span>
                </div>
              ))}

            <span className="absolute top-4 left-4 bg-black/40 text-white text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              {gradientType === 'mesh' ? 'ドラッグで色位置を移動可能' : 'グラデーションプレビュー'}
            </span>
          </div>

          {/* クイックアクション */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={toggleSitePreview}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border-2 font-black text-xs transition-all cursor-pointer ${
                isAppliedToSite
                  ? 'bg-secondary text-text border-border hover:bg-secondary/80'
                  : 'bg-accent text-white border-border hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-y-0 active:shadow-none'
              }`}
            >
              {isAppliedToSite ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>サイト背景を解除</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>本サイト全体に適用テスト</span>
                </>
              )}
            </button>
            <button
              onClick={downloadPng}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-border bg-card hover:bg-secondary text-text font-bold text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PNG画像エクスポート (1200x800)</span>
            </button>
          </div>

          {/* 出力コード表示 */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm text-slate-100 space-y-4">
            {/* CSS コード */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  CSS DECLARATION
                </span>
                <button
                  onClick={() => handleCopy(fullCssDeclaration, 'css')}
                  className="p-1 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedType === 'css' ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>CSSコピー</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                {fullCssDeclaration}
              </pre>
            </div>

            {/* CSS 変数 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                  CSS VARIABLE
                </span>
                <button
                  onClick={() =>
                    handleCopy(`--gradient-custom: ${cssValue.replace(/\n  /g, ' ')};`, 'var')
                  }
                  className="p-1 px-2.5 rounded-lg border border-slate-700 bg-slate-800 text-[10px] text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedType === 'var' ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>変数コピー</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-[10px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-900 overflow-x-auto truncate select-all">
                {`--gradient-custom: ${cssValue.replace(/\n  /g, ' ')};`}
              </pre>
            </div>
          </div>
        </div>

        {/* 右側：コントロールパネル (5列) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
            <h3 className="font-black text-sm border-b-2 border-border pb-3 mb-5 text-text">
              グラデーションパラメータ設定
            </h3>

            {/* Linear / Radial 設定用コントローラ */}
            {gradientType !== 'mesh' && (
              <div className="space-y-6">
                {/* 角度調整 (Linear限定) */}
                {gradientType === 'linear' && (
                  <div>
                    <div className="flex justify-between items-center mb-2 text-xs font-bold text-text/80">
                      <label className="flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>角度 (Angle)</span>
                      </label>
                      <span className="font-mono bg-secondary px-1.5 py-0.5 rounded text-text/60">
                        {angle}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full accent-accent bg-secondary h-2 rounded-lg cursor-pointer animate-none"
                    />
                  </div>
                )}

                {/* 放射中心 & 形状調整 (Radial限定) */}
                {gradientType === 'radial' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-text/80 mb-1.5">
                          形状 (Shape)
                        </label>
                        <select
                          value={shape}
                          onChange={(e) => setShape(e.target.value as 'circle' | 'ellipse')}
                          className="w-full bg-secondary border-2 border-border rounded-xl px-2 py-2 text-xs text-text focus:outline-none"
                        >
                          <option value="circle">円形 (Circle)</option>
                          <option value="ellipse">楕円形 (Ellipse)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span>中心位置 X</span>
                          <span className="font-mono text-text/60">{posX}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={posX}
                          onChange={(e) => setPosX(Number(e.target.value))}
                          className="w-full accent-accent bg-secondary h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span>中心位置 Y</span>
                          <span className="font-mono text-text/60">{posY}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={posY}
                          onChange={(e) => setPosY(Number(e.target.value))}
                          className="w-full accent-accent bg-secondary h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* カラーポイントリスト */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-text/80">カラーポイント配置</label>
                    <button
                      onClick={addColorStop}
                      disabled={colorStops.length >= 10}
                      className="px-2 py-1 bg-secondary text-text border border-border rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>追加</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                    {colorStops.map((stop) => (
                      <div
                        key={stop.id}
                        className="flex items-center gap-3 bg-secondary/20 p-2.5 border border-border rounded-xl"
                      >
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                          className="w-8 h-8 rounded-lg border border-border cursor-pointer shrink-0"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="font-mono uppercase">{stop.color}</span>
                            <span className="font-mono text-text/60">{stop.position}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) =>
                              updateColorStop(stop.id, { position: Number(e.target.value) })
                            }
                            className="w-full accent-accent h-1 rounded bg-secondary cursor-pointer"
                          />
                        </div>
                        <button
                          onClick={() => removeColorStop(stop.id)}
                          disabled={colorStops.length <= 2}
                          className="p-1 rounded bg-card border border-border hover:bg-red-50 dark:hover:bg-red-950 text-text/40 hover:text-red-500 disabled:opacity-40 cursor-pointer transition-colors"
                          title="この色を削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mesh 設定用コントローラ */}
            {gradientType === 'mesh' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-text/80">メッシュカラーポイント</label>
                  <button
                    onClick={addMeshPoint}
                    disabled={meshPoints.length >= 8}
                    className="px-2 py-1 bg-secondary text-text border border-border rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-secondary/80 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>色の追加</span>
                  </button>
                </div>

                {/* メッシュポイントリスト (タブ選択式) */}
                <div className="flex flex-wrap gap-1.5">
                  {meshPoints.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveMeshPointId(p.id)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeMeshPointId === p.id
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-border bg-card text-text/80 hover:bg-secondary'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/40"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>カラー {idx + 1}</span>
                    </button>
                  ))}
                </div>

                {/* 選択中のメッシュポイントのパラメータ調整 */}
                {activePoint && (
                  <div className="p-4 bg-secondary/20 border border-border rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-text/80">選択カラーの設定</span>
                      <button
                        onClick={() => removeMeshPoint(activePoint.id)}
                        disabled={meshPoints.length <= 2}
                        className="text-[10px] text-red-500 font-bold hover:underline disabled:opacity-40 cursor-pointer"
                      >
                        このポイントを削除
                      </button>
                    </div>

                    {/* 色の選択 */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div>
                        <label className="block text-[10px] font-bold text-text/60 mb-1">
                          カラーコード
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activePoint.color}
                            onChange={(e) =>
                              updateMeshPoint(activePoint.id, { color: e.target.value })
                            }
                            className="w-8 h-8 rounded-lg border border-border cursor-pointer shrink-0"
                          />
                          <input
                            type="text"
                            value={activePoint.color}
                            onChange={(e) =>
                              updateMeshPoint(activePoint.id, { color: e.target.value })
                            }
                            className="w-full bg-card border border-border rounded-lg px-2 py-1 text-xs font-mono uppercase focus:outline-none text-text"
                          />
                        </div>
                      </div>

                      {/* 範囲(サイズ)調整 */}
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-text/60 mb-1">
                          <span>影響範囲 (Radius)</span>
                          <span className="font-mono text-text">{activePoint.radius}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="150"
                          value={activePoint.radius}
                          onChange={(e) =>
                            updateMeshPoint(activePoint.id, { radius: Number(e.target.value) })
                          }
                          className="w-full accent-accent h-1 rounded bg-secondary cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 位置(X / Y)調整 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-text/60 mb-1">
                          <span>位置 X</span>
                          <span className="font-mono text-text">{activePoint.x}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={activePoint.x}
                          onChange={(e) =>
                            updateMeshPoint(activePoint.id, { x: Number(e.target.value) })
                          }
                          className="w-full accent-accent h-1 rounded bg-secondary cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-text/60 mb-1">
                          <span>位置 Y</span>
                          <span className="font-mono text-text">{activePoint.y}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={activePoint.y}
                          onChange={(e) =>
                            updateMeshPoint(activePoint.id, { y: Number(e.target.value) })
                          }
                          className="w-full accent-accent h-1 rounded bg-secondary cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* 不透明度調整 */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-text/60 mb-1">
                        <span>不透明度 (Opacity)</span>
                        <span className="font-mono text-text">
                          {Math.round(activePoint.opacity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={activePoint.opacity}
                        onChange={(e) =>
                          updateMeshPoint(activePoint.id, { opacity: Number(e.target.value) })
                        }
                        className="w-full accent-accent h-1 rounded bg-secondary cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
