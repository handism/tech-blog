'use client';

import { useEffect, useRef, useState } from 'react';

// =====================
// Types
// =====================

type Size = { width: number; height: number; label: string };
type Density = { name: string; min: number; max: number };
type ColorPalette = {
  name: string;
  primary: string[];
  secondary: string[];
  backgrounds: string[];
};

type SizeKey = 'youtube' | 'instagram' | 'twitter';
type DensityKey = 'simple' | 'standard' | 'busy';
type ToneKey = 'pale' | 'light' | 'bright' | 'vivid';
type BackgroundMode = 'auto' | 'custom' | 'transparent';

// =====================
// Constants
// =====================

const sizes: Record<SizeKey, Size> = {
  youtube: { width: 1280, height: 720, label: 'YouTube サムネイル (1280×720)' },
  instagram: { width: 1080, height: 1080, label: 'Instagram 投稿 (1080×1080)' },
  twitter: { width: 1200, height: 675, label: 'X (Twitter) 投稿 (1200×675)' },
};

const densities: Record<DensityKey, Density> = {
  simple: { name: 'シンプル', min: 8, max: 15 },
  standard: { name: '標準', min: 20, max: 30 },
  busy: { name: '賑やか', min: 35, max: 50 },
};

const colorPalettes: Record<ToneKey, ColorPalette> = {
  pale: {
    name: 'ペールトーン',
    primary: ['#FFB3C1', '#FFFACD', '#B4E7F5', '#D4C5F9', '#FFB6B9'],
    secondary: ['#C9E4CA', '#FFF4E0', '#E8C4F7', '#C1E1C1', '#FAD2E1'],
    backgrounds: ['#FFF9F3', '#F7F9FB', '#FFF5F7', '#F8F9FF', '#FFFEF7'],
  },
  light: {
    name: 'ライトトーン',
    primary: ['#FFD4E5', '#FFF9B1', '#C4E8F5', '#E5D4FF', '#FFD4D4'],
    secondary: ['#D4F1D4', '#FFEAA7', '#DFD4FF', '#D4F5E8', '#FFE4E8'],
    backgrounds: ['#FFFBF5', '#F5FAFF', '#FFF7FA', '#FAFBFF', '#FFFFF5'],
  },
  bright: {
    name: 'ブライトトーン',
    primary: ['#FF9EBB', '#FFE066', '#66D9EF', '#B98FFF', '#FF8A8A'],
    secondary: ['#8FE8A0', '#FFD93D', '#C78FFF', '#6EDDB8', '#FFA8B8'],
    backgrounds: ['#FFF8F0', '#F0F8FF', '#FFF3F8', '#F8F0FF', '#FFFEF0'],
  },
  vivid: {
    name: 'ビビッドトーン',
    primary: ['#FF6B9D', '#FEC601', '#00D9FF', '#A259FF', '#FF4E50'],
    secondary: ['#00E676', '#FFD600', '#D500F9', '#00BFA5', '#FF1744'],
    backgrounds: ['#FFF5E6', '#E8F4F8', '#FFF0F5', '#F0F8FF', '#FFFACD'],
  },
};

// =====================
// Utils
// =====================

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const getRandomColor = (palette: string[], seed: number): string => {
  const index = Math.floor(seededRandom(seed) * palette.length);
  return palette[index];
};

// =====================
// Component
// =====================

export default function MemphisGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedSize, setSelectedSize] = useState<SizeKey>('youtube');
  const [selectedTone, setSelectedTone] = useState<ToneKey>('pale');
  const [selectedDensity, setSelectedDensity] = useState<DensityKey>('standard');
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('auto');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#FFF9F3');
  const [seed, setSeed] = useState(() => Date.now());

  const colors = colorPalettes[selectedTone];

  // =====================
  // Drawing
  // =====================

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    if (backgroundMode === 'custom') {
      ctx.fillStyle = customBackgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else if (backgroundMode === 'auto') {
      ctx.fillStyle = getRandomColor(colors.backgrounds, seed);
      ctx.fillRect(0, 0, width, height);
    }

    let s = seed;
    const { min, max } = densities[selectedDensity];
    const count = min + Math.floor(seededRandom(s++) * (max - min + 1));

    for (let i = 0; i < count; i++) {
      const type = Math.floor(seededRandom(s++) * 7);
      const x = seededRandom(s++) * width;
      const y = seededRandom(s++) * height;
      const size = 30 + seededRandom(s++) * 150;
      const rot = seededRandom(s++) * Math.PI * 2;
      const color =
        seededRandom(s++) > 0.5
          ? getRandomColor(colors.primary, s++)
          : getRandomColor(colors.secondary, s++);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = seededRandom(s++) > 0.8 ? 4 : 0;

      switch (type) {
        case 0:
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          seededRandom(s++) > 0.5 ? ctx.fill() : ctx.stroke();
          break;
        case 1:
          ctx.fillRect(-size / 2, -size / 2, size, size);
          break;
        case 2:
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.closePath();
          seededRandom(s++) > 0.5 ? ctx.fill() : ctx.stroke();
          break;
        case 3:
          ctx.beginPath();
          ctx.lineWidth = 5;
          for (let j = 0; j < 5; j++) {
            ctx.lineTo((j - 2.5) * 30, (j % 2) * 30 - 15);
          }
          ctx.stroke();
          break;
        case 4:
          ctx.beginPath();
          ctx.lineWidth = 5;
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const wx = t * 20 - 60;
            const wy = Math.sin(t * 3) * 20;
            t === 0 ? ctx.moveTo(wx, wy) : ctx.lineTo(wx, wy);
          }
          ctx.stroke();
          break;
        case 5:
          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
              ctx.beginPath();
              ctx.arc(dx * 15, dy * 15, 4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          break;
        case 6:
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI);
          seededRandom(s++) > 0.5 ? ctx.fill() : ctx.stroke();
          break;
      }

      ctx.restore();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = sizes[selectedSize];
    canvas.width = width;
    canvas.height = height;
    draw(ctx, width, height);
  }, [selectedSize, selectedTone, selectedDensity, backgroundMode, customBackgroundColor, seed]);

  // =====================
  // Actions
  // =====================

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `memphis-${seed}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  // =====================
  // UI
  // =====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Memphis Generator
          </h1>
          <p className="mt-4 text-white/90 text-lg">80年代風のカラフルな背景画像を生成</p>
        </header>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          {/* Controls */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <section>
                <h2 className="mb-3 font-bold">サイズ</h2>
                <div className="grid gap-2">
                  {(Object.keys(sizes) as SizeKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedSize(k)}
                      className={`rounded-xl border px-4 py-3 text-left font-semibold transition ${
                        selectedSize === k
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {sizes[k].label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 font-bold">トーン</h2>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(colorPalettes) as ToneKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedTone(k)}
                      className={`rounded-xl border px-4 py-3 font-semibold transition ${
                        selectedTone === k
                          ? 'border-pink-500 bg-pink-50 text-pink-600'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {colorPalettes[k].name}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-3 font-bold">密度</h2>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(densities) as DensityKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => setSelectedDensity(k)}
                      className={`rounded-xl border px-3 py-3 font-semibold transition ${
                        selectedDensity === k
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-600'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {densities[k].name}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center rounded-2xl border bg-gray-50 p-4">
              <canvas ref={canvasRef} className="max-h-[500px] max-w-full" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setSeed(Date.now())}
              className="rounded-xl bg-gradient-to-r from-yellow-400 to-pink-500 py-4 font-bold text-white shadow-lg hover:opacity-90"
            >
              新しく生成
            </button>
            <button
              onClick={downloadPNG}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 font-bold text-white shadow-lg hover:opacity-90"
            >
              PNG ダウンロード
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
