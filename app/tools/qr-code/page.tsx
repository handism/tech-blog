'use client';

import { QrCode } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

type ErrorCorrectLevel = 'L' | 'M' | 'Q' | 'H';

export default function QrCodeGenerator() {
  const [input, setInput] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<ErrorCorrectLevel>('H');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (input && canvasRef.current) {
      Promise.resolve().then(() => {
        setIsLoading(true);
      });
      QRCode.toCanvas(
        canvasRef.current,
        input,
        {
          width: size,
          margin: 2,
          errorCorrectionLevel: level,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        },
        (error) => {
          if (error) {
            console.error(error);
          }
          setIsLoading(false);
        }
      );
    }
  }, [input, size, level, fgColor, bgColor]);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'qrcode.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <QrCode className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">QR コード生成</h1>
          </div>

          <div className="space-y-6">
            {/* 入力フィールド */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                エンコード対象のテキスト・URL
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="URL またはテキストを入力"
                className="w-full h-24 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* 設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  サイズ: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="16"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  エラー訂正レベル
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as ErrorCorrectLevel)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  前景色（QR コード）
                </label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full h-10 px-2 border border-slate-300 dark:border-slate-500 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  背景色
                </label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-10 px-2 border border-slate-300 dark:border-slate-500 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* QR コード表示 */}
            {input && (
              <div className="flex flex-col items-center space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  {isLoading && <p className="text-slate-600 dark:text-slate-400">生成中...</p>}
                  <canvas ref={canvasRef} style={{ display: isLoading ? 'none' : 'block' }} />
                </div>

                {/* ダウンロードボタン */}
                <button
                  onClick={downloadQRCode}
                  disabled={isLoading}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  QR コードをダウンロード
                </button>
              </div>
            )}

            {/* 情報 */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg text-sm space-y-2">
              <p className="font-semibold">エラー訂正レベルについて:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>L: 7% まで修復可能（最小サイズ）</li>
                <li>M: 15% まで修復可能</li>
                <li>Q: 25% まで修復可能</li>
                <li>H: 30% まで修復可能（最大冗長性）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
