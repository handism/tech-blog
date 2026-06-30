'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function ColorConverter() {
  const { copy } = useCopyToClipboard();
  const [color, setColor] = useState<Color>({
    hex: '#FF5733',
    rgb: { r: 255, g: 87, b: 51 },
    hsl: { h: 11, s: 100, l: 60 },
  });
  const [input, setInput] = useState('#FF5733');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setInput(hex);
    if (/^#[0-9A-F]{6}$/.test(hex)) {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({ hex, rgb, hsl });
    }
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...color.rgb, [channel]: Math.max(0, Math.min(255, value)) };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setColor({ hex, rgb: newRgb, hsl });
    setInput(hex);
  };

  const handleHslChange = (channel: 'h' | 's' | 'l', value: number) => {
    let newHsl = { ...color.hsl, [channel]: value };
    if (channel === 'h') newHsl.h = Math.max(0, Math.min(360, value));
    else newHsl = { ...newHsl, [channel]: Math.max(0, Math.min(100, value)) };

    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor({ hex, rgb, hsl: newHsl });
    setInput(hex);
  };

  const copyToClipboard = (text: string) => {
    copy(text);
  };

  return (
    <ToolPageLayout title="色コード変換" icon={Palette}>
      <div className="space-y-6">
        {/* カラープレビュー */}
        <div className="flex justify-center">
          <div
            className="w-48 h-48 rounded-lg shadow-lg border-4 border-slate-200 dark:border-slate-600 transition"
            style={{ backgroundColor: color.hex }}
          />
        </div>

        {/* HEX 入力 */}
        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">HEX コード</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={handleHexChange}
              placeholder="#RRGGBB"
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono text-lg"
            />
            <button
              onClick={() => copyToClipboard(color.hex)}
              className="px-4 py-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-800 dark:text-white rounded-lg transition"
            >
              コピー
            </button>
          </div>
        </div>

        {/* RGB 入力 */}
        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">RGB</h2>
          <div className="grid grid-cols-3 gap-4">
            {(['r', 'g', 'b'] as const).map((channel) => (
              <div key={channel}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {channel.toUpperCase()}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={color.rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white dark:bg-slate-600 rounded border border-slate-200 dark:border-slate-500 font-mono text-sm text-slate-900 dark:text-white">
            rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
          </div>
        </div>

        {/* HSL 入力 */}
        <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">HSL</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                H (0-360)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={color.hsl.h}
                  onChange={(e) => handleHslChange('h', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={color.hsl.h}
                  onChange={(e) => handleHslChange('h', Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                S (0-100)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={color.hsl.s}
                  onChange={(e) => handleHslChange('s', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={color.hsl.s}
                  onChange={(e) => handleHslChange('s', Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                L (0-100)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={color.hsl.l}
                  onChange={(e) => handleHslChange('l', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={color.hsl.l}
                  onChange={(e) => handleHslChange('l', Number(e.target.value))}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white dark:bg-slate-600 rounded border border-slate-200 dark:border-slate-500 font-mono text-sm text-slate-900 dark:text-white">
            hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
