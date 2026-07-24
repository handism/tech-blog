import { describe, expect, it } from 'vitest';
import { getGcd, calculateTargetDimension, calculateSimplifiedRatio } from '@/src/lib/aspect-ratio';

describe('getGcd', () => {
  it('正の整数の最大公約数を正確に計算する', () => {
    expect(getGcd(1920, 1080)).toBe(120);
    expect(getGcd(16, 9)).toBe(1);
    expect(getGcd(4, 3)).toBe(1);
    expect(getGcd(100, 25)).toBe(25);
  });

  it('どちらかが0の場合、もう一方の絶対値を返す', () => {
    expect(getGcd(10, 0)).toBe(10);
    expect(getGcd(0, 5)).toBe(5);
  });

  it('負の数が入力された場合、絶対値で計算する', () => {
    expect(getGcd(-1920, 1080)).toBe(120);
    expect(getGcd(1920, -1080)).toBe(120);
  });

  it('小数の入力は四捨五入して整数処理する', () => {
    expect(getGcd(16.2, 9.1)).toBe(1);
  });
});

describe('calculateTargetDimension', () => {
  it('16:9 の比率で幅 1920px から高さ 1080px を算出する', () => {
    expect(calculateTargetDimension(1920, 16, 9)).toBe(1080);
  });

  it('16:9 の比率で高さ 1080px から幅 1920px を算出する', () => {
    expect(calculateTargetDimension(1080, 9, 16)).toBe(1920);
  });

  it('4:3 の比率で幅 1024px から高さ 768px を算出する', () => {
    expect(calculateTargetDimension(1024, 4, 3)).toBe(768);
  });

  it('四捨五入して整数に丸める', () => {
    // (100 * 9) / 16 = 56.25 -> 56
    expect(calculateTargetDimension(100, 16, 9)).toBe(56);
  });

  it('空文字、0以下の無効値が含まれる場合は空文字を返す', () => {
    expect(calculateTargetDimension('', 16, 9)).toBe('');
    expect(calculateTargetDimension(1920, '', 9)).toBe('');
    expect(calculateTargetDimension(1920, 16, '')).toBe('');
    expect(calculateTargetDimension(0, 16, 9)).toBe('');
    expect(calculateTargetDimension(1920, 0, 9)).toBe('');
    expect(calculateTargetDimension(1920, 16, -1)).toBe('');
  });
});

describe('calculateSimplifiedRatio', () => {
  it('一般的な解像度からアスペクト比を約分して求める', () => {
    expect(calculateSimplifiedRatio(1920, 1080)).toBe('16 : 9');
    expect(calculateSimplifiedRatio(1280, 720)).toBe('16 : 9');
    expect(calculateSimplifiedRatio(1024, 768)).toBe('4 : 3');
    expect(calculateSimplifiedRatio(1080, 1080)).toBe('1 : 1');
    expect(calculateSimplifiedRatio(2560, 1080)).toBe('64 : 27');
  });

  it('約分後の値が100を超える場合は小数比率 (x : 1) にフォールバックする', () => {
    // 1920 / 1079 -> 約分できず 1920 > 100 となり小数表現に
    expect(calculateSimplifiedRatio(1920, 1079)).toBe('1.779 : 1');
  });

  it('空文字や無効値の場合は空文字を返す', () => {
    expect(calculateSimplifiedRatio('', 1080)).toBe('');
    expect(calculateSimplifiedRatio(1920, '')).toBe('');
    expect(calculateSimplifiedRatio(0, 1080)).toBe('');
    expect(calculateSimplifiedRatio(1920, -10)).toBe('');
  });
});
