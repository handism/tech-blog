// src/components/tools/color/ColorConverter.tsx
'use client';

import { useState } from 'react';
import CopyButton from '@/src/components/CopyButton';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function ColorConverter() {
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

  return (
    <div className="space-y-6 text-text max-w-3xl mx-auto">
      {/* カラープレビュー */}
      <div className="flex justify-center">
        <div
          className="w-48 h-48 rounded-lg shadow-[4px_4px_0px_0px_var(--border)] border-4 border-border transition-all"
          style={{ backgroundColor: color.hex }}
        />
      </div>

      {/* HEX 入力 */}
      <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
        <h2 className="text-sm font-black text-text/60 uppercase tracking-wider mb-4">
          HEX コード
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={handleHexChange}
            placeholder="#RRGGBB"
            className="theme-input flex-1 placeholder-text/40 font-mono text-base font-bold"
          />
          <CopyButton
            value={color.hex}
            className="theme-btn px-4 py-2 bg-secondary border-2 border-border text-text font-bold rounded-lg transition hover:bg-border/25 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer flex items-center gap-1"
          />
        </div>
      </div>

      {/* RGB 入力 */}
      <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
        <h2 className="text-sm font-black text-text/60 uppercase tracking-wider mb-4">
          RGB (0-255)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['r', 'g', 'b'] as const).map((channel) => (
            <div key={channel} className="space-y-2">
              <label className="block text-xs font-bold text-text/80">
                {channel.toUpperCase()}
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={color.rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                  className="theme-input w-20 font-bold"
                />
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={color.rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, Number(e.target.value))}
                  className="flex-1 accent-accent cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-secondary text-text font-mono text-sm rounded border border-border/80 shadow-inner select-all flex justify-between items-center font-bold">
          <span>
            rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
          </span>
          <CopyButton
            value={`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`}
            className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold"
          />
        </div>
      </div>

      {/* HSL 入力 */}
      <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
        <h2 className="text-sm font-black text-text/60 uppercase tracking-wider mb-4">
          HSL (Hue / Saturation / Lightness)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text/80">H (0-360)</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min="0"
                max="360"
                value={color.hsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="theme-input w-20 font-bold"
              />
              <input
                type="range"
                min="0"
                max="360"
                value={color.hsl.h}
                onChange={(e) => handleHslChange('h', Number(e.target.value))}
                className="flex-1 accent-accent cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text/80">S (0-100%)</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={color.hsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="theme-input w-20 font-bold"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={color.hsl.s}
                onChange={(e) => handleHslChange('s', Number(e.target.value))}
                className="flex-1 accent-accent cursor-pointer"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-text/80">L (0-100%)</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={color.hsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="theme-input w-20 font-bold"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={color.hsl.l}
                onChange={(e) => handleHslChange('l', Number(e.target.value))}
                className="flex-1 accent-accent cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-secondary text-text font-mono text-sm rounded border border-border/80 shadow-inner select-all flex justify-between items-center font-bold">
          <span>
            hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
          </span>
          <CopyButton
            value={`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`}
            className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold"
          />
        </div>
      </div>
    </div>
  );
}
