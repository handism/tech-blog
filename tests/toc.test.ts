import { describe, it, expect } from 'vitest';
import { generateTocFromHast } from '../src/lib/toc';

describe('generateTocFromHast', () => {
  it('should generate TOC from valid h1-h6 tags', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h1',
          properties: { id: 'heading-1' },
          children: [{ type: 'text', value: 'Heading 1' }],
        },
        {
          type: 'element',
          tagName: 'h2',
          properties: { id: 'heading-2' },
          children: [{ type: 'text', value: 'Heading 2' }],
        },
        {
          type: 'element',
          tagName: 'h6',
          properties: { id: 'heading-6' },
          children: [{ type: 'text', value: 'Heading 6' }],
        },
      ],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([
      { id: 'heading-1', text: 'Heading 1', level: 1 },
      { id: 'heading-2', text: 'Heading 2', level: 2 },
      { id: 'heading-6', text: 'Heading 6', level: 6 },
    ]);
  });

  it('should ignore non-heading tags', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: { id: 'paragraph' },
          children: [{ type: 'text', value: 'Paragraph text' }],
        },
        {
          type: 'element',
          tagName: 'div',
          children: [{ type: 'text', value: 'Div text' }],
        },
      ],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([]);
  });

  it('should handle nested elements and accumulate text', () => {
    const tree = {
      type: 'element',
      tagName: 'h3',
      properties: { id: 'nested-heading' },
      children: [
        { type: 'text', value: 'Heading ' },
        {
          type: 'element',
          tagName: 'span',
          children: [{ type: 'text', value: 'with span' }],
        },
        { type: 'text', value: ' and more' },
      ],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([{ id: 'nested-heading', text: 'Heading with span and more', level: 3 }]);
  });

  it('should handle elements without ids', () => {
    const tree = {
      type: 'element',
      tagName: 'h4',
      children: [{ type: 'text', value: 'Heading without id' }],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([{ id: '', text: 'Heading without id', level: 4 }]);
  });

  it('should handle elements with non-string ids', () => {
    const tree = {
      type: 'element',
      tagName: 'h5',
      properties: { id: 123 },
      children: [{ type: 'text', value: 'Heading with numeric id' }],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([{ id: '', text: 'Heading with numeric id', level: 5 }]);
  });

  it('should ignore headings with empty text', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'h2',
          properties: { id: 'empty-1' },
          children: [{ type: 'text', value: '   ' }], // Only spaces
        },
        {
          type: 'element',
          tagName: 'h2',
          properties: { id: 'empty-2' },
          children: [], // No children
        },
      ],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([]);
  });

  it('should walk through nested structure to find headings', () => {
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          children: [
            {
              type: 'element',
              tagName: 'h2',
              properties: { id: 'nested-h2' },
              children: [{ type: 'text', value: 'Nested H2' }],
            },
          ],
        },
      ],
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([{ id: 'nested-h2', text: 'Nested H2', level: 2 }]);
  });

  it('should return empty array for null or invalid inputs', () => {
    expect(generateTocFromHast(null)).toEqual([]);
    expect(generateTocFromHast(undefined)).toEqual([]);
    expect(generateTocFromHast('string')).toEqual([]);
    expect(generateTocFromHast(123)).toEqual([]);
    expect(generateTocFromHast({})).toEqual([]); // Missing 'type' property
  });

  it('should return empty string for text nodes with null/undefined value', () => {
    const tree = {
      type: 'element',
      tagName: 'h2',
      properties: { id: 'heading-1' },
      children: [{ type: 'text' }], // Missing value
    };

    const toc = generateTocFromHast(tree);
    expect(toc).toEqual([]);
  });
});
