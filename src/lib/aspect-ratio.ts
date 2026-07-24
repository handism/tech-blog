/**
 * <input type="number"> の入力値 (string) を安全に parse して number または '' を返す
 */
export const parseNumberInput = (value: string): number | '' => {
  if (value.trim() === '') {
    return '';
  }
  const num = Number(value);
  return isNaN(num) ? '' : num;
};

/**
 * 数値の小数点以下の桁数を取得する（最大 6 桁まで）
 */
export const getDecimalPlaces = (num: number): number => {
  if (!isFinite(num) || Math.floor(num) === num) {
    return 0;
  }
  const str = num.toString();
  if (str.includes('.')) {
    const decimals = str.split('.')[1].length;
    return Math.min(decimals, 6);
  }
  return 0;
};

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
  return isNaN(result) || !isFinite(result) || result > Number.MAX_SAFE_INTEGER ? '' : result;
};

/**
 * 入力された幅・高さから最も約分されたアスペクト比の文字列を算出する
 * 例: 1920, 1080 -> "16 : 9"
 * 小数入力 (1.5, 1 -> 3 : 2) も正確に動的桁数から整数比に変換する
 * 極端に大きい値（約分後 > 100 や MAX_SAFE_INTEGER 超え）の場合は小数表現 "1.778 : 1" にフォールバックする
 */
export const calculateSimplifiedRatio = (inputW: number | '', inputH: number | ''): string => {
  if (
    inputW === '' ||
    inputH === '' ||
    inputW <= 0 ||
    inputH <= 0 ||
    !isFinite(inputW) ||
    !isFinite(inputH) ||
    inputW > Number.MAX_SAFE_INTEGER ||
    inputH > Number.MAX_SAFE_INTEGER
  ) {
    return '';
  }

  // 小数点以下の最大桁数を取得し、動的倍率 (10^decimals) で整数化
  const decW = getDecimalPlaces(inputW);
  const decH = getDecimalPlaces(inputH);
  const maxDecimals = Math.max(decW, decH);
  const factor = Math.pow(10, maxDecimals);

  const intW = Math.round(inputW * factor);
  const intH = Math.round(inputH * factor);

  if (intW > Number.MAX_SAFE_INTEGER || intH > Number.MAX_SAFE_INTEGER) {
    const floatRatio = (inputW / inputH).toFixed(3);
    return `${floatRatio} : 1`;
  }

  const gcd = getGcd(intW, intH);

  if (gcd === 0) {
    return '';
  }

  const simpleW = Math.round((intW / gcd) * 1000) / 1000;
  const simpleH = Math.round((intH / gcd) * 1000) / 1000;

  // 大きすぎる値の場合は少数形式で簡略表示
  if (simpleW > 100 || simpleH > 100) {
    const floatRatio = (inputW / inputH).toFixed(3);
    return `${floatRatio} : 1`;
  }

  return `${simpleW} : ${simpleH}`;
};
