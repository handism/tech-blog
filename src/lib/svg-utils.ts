import DOMPurify from 'dompurify';

/**
 * SVGコードをサニタイズしてXSS攻撃を防ぎます。
 * 許可されるのは標準のSVG要素と属性のみです。
 *
 * @param inputSvg サニタイズ対象のSVG文字列
 * @returns サニタイズ済みのSVG文字列。失敗した場合は空文字を返します。
 */
export const sanitizeSvg = (inputSvg: string): string => {
  try {
    return DOMPurify.sanitize(inputSvg, { USE_PROFILES: { svg: true } });
  } catch {
    return '';
  }
};

/**
 * SVGコード内の不要なコメント、XML宣言、独自メタデータなどを削除し、空白を圧縮して最適化します。
 *
 * @param svg 最適化対象のSVG文字列
 * @returns 最適化済みのSVG文字列
 */
export const optimizeSvg = (svg: string): string => {
  let res = svg.trim();
  // コメントの削除
  res = res.replace(/<!--[\s\S]*?-->/g, '');
  // XML宣言、DOCTYPEの削除
  res = res.replace(/<\?xml[\s\S]*?\?>/g, '');
  res = res.replace(/<!DOCTYPE[\s\S]*?>/g, '');
  // InkscapeやIllustratorの独自属性・メタデータを削除
  res = res.replace(/xmlns:(sodipodi|inkscape|illustrator|adobe)="[^"]*"/gi, '');
  res = res.replace(/(sodipodi|inkscape|i|a):[a-z-]+="[^"]*"/gi, '');
  // 空白文字の圧縮
  res = res.replace(/\s+/g, ' ');
  res = res.replace(/>\s+</g, '><');
  return res.trim();
};
