// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { sanitizeSvg, optimizeSvg } from '@/src/lib/svg-utils';

describe('svg-utils', () => {
  describe('sanitizeSvg', () => {
    it('悪意のあるスクリプトを削除する', () => {
      const maliciousSvg = '<svg><script>alert("XSS")</script><g><path d="M0,0 L10,10"/></g></svg>';
      const sanitized = sanitizeSvg(maliciousSvg);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert("XSS")');
      expect(sanitized).toContain('<svg>');
      expect(sanitized).toContain('<path');
    });

    it('on* イベントハンドラを削除する', () => {
      const maliciousSvg = '<svg onload="alert(1)" onclick="alert(2)"><circle r="10" /></svg>';
      const sanitized = sanitizeSvg(maliciousSvg);
      expect(sanitized).not.toContain('onload');
      expect(sanitized).not.toContain('onclick');
      expect(sanitized).toContain('<circle');
    });

    it('正常なSVGはそのまま維持される', () => {
      const safeSvg =
        '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="red"></circle></svg>';
      const sanitized = sanitizeSvg(safeSvg);
      // DOMPurifyは属性の順序を変更する可能性があるため、必要な要素が含まれるかを確認
      expect(sanitized).toContain('viewBox="0 0 100 100"');
      expect(sanitized).toContain('cx="50"');
      expect(sanitized).toContain('cy="50"');
      expect(sanitized).toContain('fill="red"');
    });
  });

  describe('optimizeSvg', () => {
    it('コメントを削除する', () => {
      const svgWithComments = '<svg><!-- これはコメントです --><path d="M0,0 L10,10"/></svg>';
      const optimized = optimizeSvg(svgWithComments);
      expect(optimized).toBe('<svg><path d="M0,0 L10,10"/></svg>');
    });

    // InkscapeやIllustratorの独自属性・メタデータを削除するテスト
    it('XML宣言とDOCTYPEを削除する', () => {
      const svgWithXmlDeclaration =
        '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg><path d="M0,0 L10,10"/></svg>';
      const optimized = optimizeSvg(svgWithXmlDeclaration);
      expect(optimized).toBe('<svg><path d="M0,0 L10,10"/></svg>');
    });

    it('独自メタデータ・属性を削除する', () => {
      const svgWithCustomData =
        '<svg xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" sodipodi:docname="test.svg"><path d="M0,0 L10,10"/></svg>';
      const optimized = optimizeSvg(svgWithCustomData);
      expect(optimized).toBe('<svg ><path d="M0,0 L10,10"/></svg>');
    });

    it('空白を圧縮する', () => {
      const svgWithWhitespace = `
        <svg>
          <path d="M0,0 L10,10"/>
        </svg>
      `;
      const optimized = optimizeSvg(svgWithWhitespace);
      expect(optimized).toBe('<svg><path d="M0,0 L10,10"/></svg>');
    });
  });
});
