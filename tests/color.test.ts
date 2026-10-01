// tests/color.test.ts
import { describe, expect, it } from 'vitest';
import {
  getContrastRatio,
  getLuminance,
  hexToRgb,
  hexToRgba,
  hslToRgb,
  rgbToHex,
  rgbToHsl,
} from '@/src/lib/color';

describe('hexToRgb', () => {
  it('6桁の HEX を変換する', () => {
    expect(hexToRgb('#FF5733')).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('3桁の HEX と # 省略に対応する', () => {
    expect(hexToRgb('f80')).toEqual({ r: 255, g: 136, b: 0 });
  });

  it('桁数が不正なら null を返す', () => {
    expect(hexToRgb('#12345')).toBeNull();
  });
});

describe('rgbToHex', () => {
  it('小文字・0 埋めで変換する', () => {
    expect(rgbToHex(255, 8, 0)).toBe('#ff0800');
  });

  it('範囲外の値を丸め・クランプする', () => {
    expect(rgbToHex(300, -5, 127.6)).toBe('#ff0080');
  });
});

describe('hexToRgba', () => {
  it('不透明度付きの rgba() を生成する', () => {
    expect(hexToRgba('#ff8000', 0.5)).toBe('rgba(255, 128, 0, 0.50)');
  });
});

describe('rgbToHsl / hslToRgb', () => {
  it('RGB を HSL に変換する', () => {
    expect(rgbToHsl(255, 87, 51)).toEqual({ h: 11, s: 100, l: 60 });
  });

  it('無彩色は h, s が 0 になる', () => {
    expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
  });

  it('HSL を RGB に変換する', () => {
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
  });
});

describe('getContrastRatio', () => {
  it('白と黒のコントラスト比は 21', () => {
    const ratio = getContrastRatio(getLuminance(255, 255, 255), getLuminance(0, 0, 0));
    expect(ratio).toBeCloseTo(21, 5);
  });

  it('引数の順序に依存しない', () => {
    expect(getContrastRatio(0.2, 0.8)).toBe(getContrastRatio(0.8, 0.2));
  });
});
