'use client';

import { useState, useEffect, useRef } from 'react';
import { Palette, Trash2, Eye, EyeOff, Download, PenTool, PaintBucket, Eraser } from 'lucide-react';

const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#7f7f7f',
  '#c3c3c3',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#f43f5e',
  '#b45309',
  '#15803d',
];

type Tool = 'pencil' | 'eraser' | 'bucket';

export default function PixelArtPage() {
  const [gridSize, setGridSize] = useState<number>(16);
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [activeTool, setActiveTool] = useState<Tool>('pencil');
  const [showGridLines, setShowGridLines] = useState(true);

  // 二次元配列グリッド (空文字は透明を表す)
  const [grid, setGrid] = useState<string[][]>(() =>
    Array(16)
      .fill(null)
      .map(() => Array(16).fill(''))
  );
  const isMouseDownRef = useRef(false);

  // グリッド初期化
  const initializeGrid = (size: number) => {
    const newGrid = Array(size)
      .fill(null)
      .map(() => Array(size).fill(''));
    setGrid(newGrid);
  };

  // マウスイベント関連
  useEffect(() => {
    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleCellAction = (x: number, y: number) => {
    if (activeTool === 'bucket') {
      executeFloodFill(x, y, selectedColor);
    } else {
      const colorToPaint = activeTool === 'eraser' ? '' : selectedColor;
      paintCell(x, y, colorToPaint);
    }
  };

  const paintCell = (x: number, y: number, color: string) => {
    const updated = grid.map((row, rIdx) => {
      if (rIdx === y) {
        return row.map((cell, cIdx) => (cIdx === x ? color : cell));
      }
      return row;
    });
    setGrid(updated);
  };

  // 塗りつぶし (Flood Fill - BFS)
  const executeFloodFill = (startX: number, startY: number, replacementColor: string) => {
    const targetColor = grid[startY][startX];
    if (targetColor === replacementColor) return;

    const newGrid = grid.map((row) => [...row]);
    const queue: [number, number][] = [[startX, startY]];

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      if (newGrid[cy][cx] === targetColor) {
        newGrid[cy][cx] = replacementColor;

        // 上下左右の走査
        const directions = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ];

        for (const [dx, dy] of directions) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
            if (newGrid[ny][nx] === targetColor) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }
    setGrid(newGrid);
  };

  // ドラッグして描画
  const handleMouseEnter = (x: number, y: number) => {
    if (isMouseDownRef.current && activeTool !== 'bucket') {
      const colorToPaint = activeTool === 'eraser' ? '' : selectedColor;
      paintCell(x, y, colorToPaint);
    }
  };

  // クリア
  const handleClear = () => {
    if (confirm('キャンバスをすべて消去しますか？')) {
      initializeGrid(gridSize);
    }
  };

  // SVGエクスポート
  const exportAsSvg = () => {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${gridSize} ${gridSize}" width="512" height="512" shape-rendering="crispEdges">\n`;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = grid[y][x];
        if (color) {
          svg += `  <rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />\n`;
        }
      }
    }
    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel_art_${gridSize}x${gridSize}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // PNGエクスポート
  const exportAsPng = () => {
    const exportSize = 512;
    const canvas = document.createElement('canvas');
    canvas.width = exportSize;
    canvas.height = exportSize;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, exportSize, exportSize);
      const cellSize = exportSize / gridSize;

      // エイリアス防止設定
      ctx.imageSmoothingEnabled = false;

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const color = grid[y][x];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pixel_art_${gridSize}x${gridSize}.png`;
      a.click();
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-lg bg-secondary text-text text-xs font-bold mb-3">
            <Palette className="w-3.5 h-3.5" />
            <span>Image Utilities</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Pixel Art Canvas
          </h1>
          <p className="text-text/80 text-sm md:text-base font-medium mt-2">
            グリッド上に自由にドット絵を描き、PNGやSVG形式として実スケールで保存できます。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: ツール・色選択 */}
        <div className="lg:col-span-4 space-y-6">
          {/* キャンバス設定 */}
          <div className="theme-card p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-1.5 flex items-center gap-1.5">
              <span>⚙️ キャンバス設定</span>
            </h2>
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs font-extrabold text-text/75">解像度</span>
              <div className="flex gap-2">
                {[16, 32, 64].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (
                        confirm('解像度を変更すると現在の絵がリセットされます。よろしいですか？')
                      ) {
                        setGridSize(size);
                        initializeGrid(size);
                      }
                    }}
                    className={`px-3 py-1.5 border-2 border-border rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                      gridSize === size
                        ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                    }`}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-border/10 pt-3">
              <span className="text-xs font-extrabold text-text/75">グリッド線</span>
              <button
                onClick={() => setShowGridLines(!showGridLines)}
                className="theme-btn px-2.5 py-1.5 text-xs bg-secondary flex items-center gap-1"
              >
                {showGridLines ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
                {showGridLines ? '非表示' : '表示'}
              </button>
            </div>
          </div>

          {/* ツールボックス */}
          <div className="theme-card p-5 md:p-6 space-y-4">
            <h2 className="text-sm font-bold text-text border-b border-border pb-1.5">
              🛠️ ツール選択
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pencil', label: 'ペン', icon: <PenTool className="w-4 h-4" /> },
                { id: 'eraser', label: '消しゴム', icon: <Eraser className="w-4 h-4" /> },
                { id: 'bucket', label: '塗りつぶし', icon: <PaintBucket className="w-4 h-4" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTool(t.id as Tool)}
                  className={`py-2 border-2 border-border rounded-xl text-xs font-extrabold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    activeTool === t.id
                      ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                      : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* カラーパレット */}
            <div className="space-y-3 pt-3 border-t border-border/10">
              <span className="text-xs font-extrabold text-text/75 block">カラー選択</span>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      if (activeTool === 'eraser') setActiveTool('pencil');
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-md border border-border cursor-pointer transition-transform ${
                      selectedColor === c ? 'scale-125 border-2 shadow-sm' : 'hover:scale-110'
                    }`}
                    title={c}
                  />
                ))}
              </div>

              {/* カスタムカラーピッカー */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    if (activeTool === 'eraser') setActiveTool('pencil');
                  }}
                  className="w-8 h-8 rounded border border-border cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-2 py-1 text-xs border-2 border-border rounded-lg bg-card font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム: キャンバス＆エクスポート */}
        <div className="lg:col-span-8 flex flex-col md:flex-row gap-6">
          {/* キャンバス */}
          <div className="flex-1 theme-card p-5 md:p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex justify-between w-full items-center mb-4 border-b border-border/10 pb-2">
              <span className="text-xs font-bold text-text/50">ドラッグして連続描画</span>
              <button
                onClick={handleClear}
                className="theme-btn px-2.5 py-1 text-xs bg-secondary text-red-500 flex items-center gap-1 border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> 全消去
              </button>
            </div>

            {/* ドットグリッドキャンバス */}
            <div
              className={`border-3 border-border bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,8px_0px] overflow-hidden select-none touch-none rounded-xl`}
              onMouseDown={() => {
                isMouseDownRef.current = true;
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  width: '320px',
                  height: '320px',
                }}
                className="sm:w-[400px] sm:h-[400px]"
              >
                {grid.map((row, y) =>
                  row.map((color, x) => (
                    <div
                      key={`${x}-${y}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        isMouseDownRef.current = true;
                        handleCellAction(x, y);
                      }}
                      onMouseEnter={() => handleMouseEnter(x, y)}
                      style={{
                        backgroundColor: color || 'transparent',
                      }}
                      className={`cursor-crosshair transition-none ${
                        showGridLines ? 'border-[0.5px] border-border/10' : ''
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 保存パネル */}
          <div className="w-full md:w-48 flex flex-col gap-4">
            <div className="theme-card p-5 md:p-6 flex flex-col justify-center h-full gap-4">
              <h3 className="text-sm font-bold text-text border-b border-border pb-1.5 text-center">
                💾 保存 / 出力
              </h3>

              <button
                onClick={exportAsPng}
                disabled={grid.length === 0}
                className="theme-btn py-3 bg-accent text-white flex flex-col items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="w-5 h-5" />
                <span>PNG で保存</span>
                <span className="text-[9px] font-medium opacity-80">(512x512px)</span>
              </button>

              <button
                onClick={exportAsSvg}
                disabled={grid.length === 0}
                className="theme-btn py-3 bg-card text-text flex flex-col items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="w-5 h-5" />
                <span>SVG で保存</span>
                <span className="text-[9px] font-medium opacity-80">(ベクターデータ)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
