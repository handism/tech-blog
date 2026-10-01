// src/components/tools/css/css-gradient-utils.ts
import { hexToRgba } from '@/src/lib/color';

export type GradientType = 'linear' | 'radial' | 'mesh';
export type RadialShape = 'circle' | 'ellipse';

export interface ColorStop {
  id: string;
  color: string;
  position: number; // 0 - 100
}

export interface MeshPoint {
  id: string;
  color: string;
  x: number; // 0 - 100
  y: number; // 0 - 100
  radius: number; // 10 - 100
  opacity: number; // 0 - 1
}

export interface GradientConfig {
  type: GradientType;
  colorStops: ColorStop[];
  angle: number;
  shape: RadialShape;
  posX: number;
  posY: number;
  meshPoints: MeshPoint[];
}

/** メッシュグラデーションの PNG 書き出し時の下地色 */
const MESH_BASE_COLOR = '#0a0a14';

export function randomHexColor(): string {
  return (
    '#' +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
  );
}

export function randomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function stopsToCss(colorStops: ColorStop[]): string {
  return [...colorStops]
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');
}

/**
 * CSS の background-image 値を生成する。
 * メッシュは複数の radial-gradient の重ね合わせで表現し、表示用に 1 レイヤーずつ改行する。
 */
export function buildGradientCss(config: GradientConfig): string {
  switch (config.type) {
    case 'linear':
      return `linear-gradient(${config.angle}deg, ${stopsToCss(config.colorStops)})`;
    case 'radial':
      return `radial-gradient(${config.shape} at ${config.posX}% ${config.posY}%, ${stopsToCss(config.colorStops)})`;
    case 'mesh':
      return config.meshPoints
        .map((p) => {
          const rgba = hexToRgba(p.color, p.opacity);
          return `radial-gradient(circle at ${p.x}% ${p.y}%, ${rgba} 0%, transparent ${p.radius}%)`;
        })
        .join(',\n  ');
  }
}

/**
 * 表示用の改行を除いた 1 行の CSS 値にする（style 属性・宣言文への埋め込み用）。
 */
export function toSingleLineCss(cssValue: string): string {
  return cssValue.replace(/\n {2}/g, ' ');
}

/**
 * グラデーションを Canvas に描画する（PNG 書き出し用）。
 */
export function drawGradientToCanvas(
  ctx: CanvasRenderingContext2D,
  config: GradientConfig,
  width: number,
  height: number
): void {
  if (config.type === 'linear') {
    const angleRad = (config.angle * Math.PI) / 180;
    const length = Math.abs(width * Math.sin(angleRad)) + Math.abs(height * Math.cos(angleRad));
    const halfLength = length / 2;
    const cx = width / 2;
    const cy = height / 2;

    const x0 = cx - Math.cos(angleRad - Math.PI / 2) * halfLength;
    const y0 = cy - Math.sin(angleRad - Math.PI / 2) * halfLength;
    const x1 = cx + Math.cos(angleRad - Math.PI / 2) * halfLength;
    const y1 = cy + Math.sin(angleRad - Math.PI / 2) * halfLength;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    config.colorStops.forEach((s) => grad.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  if (config.type === 'radial') {
    const cx = (config.posX / 100) * width;
    const cy = (config.posY / 100) * height;
    const maxDist = Math.max(cx, width - cx, cy, height - cy);
    const radius = config.shape === 'circle' ? maxDist : maxDist * 1.5;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    config.colorStops.forEach((s) => grad.addColorStop(s.position / 100, s.color));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    return;
  }

  ctx.fillStyle = MESH_BASE_COLOR;
  ctx.fillRect(0, 0, width, height);

  config.meshPoints.forEach((p) => {
    const px = (p.x / 100) * width;
    const py = (p.y / 100) * height;
    const radius = (p.radius / 100) * Math.max(width, height);

    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    grad.addColorStop(0, hexToRgba(p.color, p.opacity));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  });
}
