/**
 * 最大公約数 (GCD) を求める
 * 負数や小数の入力にも対応できるように Math.abs および Math.round で保護する
 */
export const getGcd = (a: number, b: number): number => {
  const absA = Math.abs(Math.round(a));
  const absB = Math.abs(Math.round(b));

  const calc = (x: number, y: number): number => {
    return y === 0 ? x : calc(y, x % y);
  };

  return calc(absA, absB);
};

/**
 * 比率と基準寸法からターゲット寸法（幅または高さ）を算出する
 */
export const calculateTargetDimension = (
  baseVal: number | '',
  baseRatio: number | '',
  targetRatio: number | ''
): number | '' => {
  if (
    baseVal === '' ||
    baseRatio === '' ||
    targetRatio === '' ||
    baseRatio <= 0 ||
    targetRatio <= 0 ||
    baseVal <= 0
  ) {
    return '';
  }

  const result = Math.round((baseVal * targetRatio) / baseRatio);
  return isNaN(result) || !isFinite(result) ? '' : result;
};

/**
 * 入力された幅・高さから最も約分されたアスペクト比の文字列を算出する
 * 例: 1920, 1080 -> "16 : 9"
 * 極端に大きい値（約分後 > 100）の場合は小数表現 "1.778 : 1" にフォールバックする
 */
export const calculateSimplifiedRatio = (inputW: number | '', inputH: number | ''): string => {
  if (inputW === '' || inputH === '') {
    return '';
  }

  const w = Number(inputW);
  const h = Number(inputH);

  if (w <= 0 || h <= 0 || isNaN(w) || isNaN(h) || !isFinite(w) || !isFinite(h)) {
    return '';
  }

  // 小数の場合は整数化してGCDを適用
  const factor = 1000;
  const intW = Math.round(w * factor);
  const intH = Math.round(h * factor);
  const gcd = getGcd(intW, intH);

  if (gcd === 0) {
    return '';
  }

  const simpleW = Math.round((intW / gcd) * 1000) / 1000;
  const simpleH = Math.round((intH / gcd) * 1000) / 1000;

  // 大きすぎる値の場合は少数形式で簡略表示
  if (simpleW > 100 || simpleH > 100) {
    const floatRatio = (w / h).toFixed(3);
    return `${floatRatio} : 1`;
  }

  return `${simpleW} : ${simpleH}`;
};
