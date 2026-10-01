import { describe, expect, it } from 'vitest';
import {
  type GradientConfig,
  buildGradientCss,
  toSingleLineCss,
} from '@/src/components/tools/css/css-gradient-utils';

const baseConfig: GradientConfig = {
  type: 'linear',
  colorStops: [
    { id: 'b', color: '#0000ff', position: 100 },
    { id: 'a', color: '#ff0000', position: 0 },
  ],
  angle: 90,
  shape: 'circle',
  posX: 25,
  posY: 75,
  meshPoints: [
    { id: 'm1', color: '#ff0000', x: 10, y: 20, radius: 50, opacity: 0.5 },
    { id: 'm2', color: '#00ff00', x: 80, y: 90, radius: 40, opacity: 1 },
  ],
};

describe('css-gradient-utils', () => {
  it('builds linear gradients with stops sorted by position', () => {
    expect(buildGradientCss(baseConfig)).toBe('linear-gradient(90deg, #ff0000 0%, #0000ff 100%)');
  });

  it('builds radial gradients with shape and position', () => {
    expect(buildGradientCss({ ...baseConfig, type: 'radial' })).toBe(
      'radial-gradient(circle at 25% 75%, #ff0000 0%, #0000ff 100%)'
    );
  });

  it('builds mesh gradients as layered radial gradients', () => {
    const css = buildGradientCss({ ...baseConfig, type: 'mesh' });
    expect(css.split(',\n  ')).toHaveLength(2);
    expect(toSingleLineCss(css)).toBe(
      'radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.50) 0%, transparent 50%), ' +
        'radial-gradient(circle at 80% 90%, rgba(0, 255, 0, 1.00) 0%, transparent 40%)'
    );
  });
});
