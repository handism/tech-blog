import { describe, it, expect } from 'vitest';
import { generateFlexboxGridCode, ItemStyle } from '../src/components/tools/css/flexbox-grid-utils';

describe('generateFlexboxGridCode', () => {
  const defaultStyles: Record<number, ItemStyle> = {
    1: {
      id: 1,
      flexGrow: 0,
      flexShrink: 1,
      alignSelf: 'auto',
      gridColumn: 'auto',
      gridRow: 'auto',
    },
    2: {
      id: 2,
      flexGrow: 0,
      flexShrink: 1,
      alignSelf: 'auto',
      gridColumn: 'auto',
      gridRow: 'auto',
    },
  };

  it('should generate Flexbox CSS configuration correctly', () => {
    const result = generateFlexboxGridCode({
      layoutMode: 'flex',
      codeFormat: 'css',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexGap: 16,
      gridCols: 'repeat(3, 1fr)',
      gridRows: 'auto',
      justifyItems: 'stretch',
      alignItemsGrid: 'stretch',
      gridGap: 16,
      itemCount: 2,
      itemStyles: defaultStyles,
    });

    expect(result).toContain('display: flex;');
    expect(result).toContain('flex-direction: row;');
    expect(result).toContain('justify-content: center;');
    expect(result).toContain('gap: 16px;');
  });

  it('should generate Flexbox Tailwind HTML configuration correctly', () => {
    const result = generateFlexboxGridCode({
      layoutMode: 'flex',
      codeFormat: 'tailwind',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'stretch',
      flexGap: 24,
      gridCols: 'repeat(3, 1fr)',
      gridRows: 'auto',
      justifyItems: 'stretch',
      alignItemsGrid: 'stretch',
      gridGap: 16,
      itemCount: 2,
      itemStyles: defaultStyles,
    });

    expect(result).toContain(
      '<div className="flex flex-col flex-nowrap justify-between items-center gap-[24px]">'
    );
    expect(result).toContain('<div>Item 1</div>');
  });

  it('should generate CSS Grid CSS configuration correctly', () => {
    const result = generateFlexboxGridCode({
      layoutMode: 'grid',
      codeFormat: 'css',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexGap: 16,
      gridCols: 'repeat(4, 1fr)',
      gridRows: '100px',
      justifyItems: 'center',
      alignItemsGrid: 'end',
      gridGap: 8,
      itemCount: 2,
      itemStyles: defaultStyles,
    });

    expect(result).toContain('display: grid;');
    expect(result).toContain('grid-template-columns: repeat(4, 1fr);');
    expect(result).toContain('grid-template-rows: 100px;');
    expect(result).toContain('justify-items: center;');
    expect(result).toContain('align-items: end;');
    expect(result).toContain('gap: 8px;');
  });

  it('should include custom item styles in output code', () => {
    const customStyles: Record<number, ItemStyle> = {
      1: {
        id: 1,
        flexGrow: 2,
        flexShrink: 0,
        alignSelf: 'center',
        gridColumn: 'span 2',
        gridRow: 'span 2',
      },
      2: {
        id: 2,
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'auto',
        gridColumn: 'auto',
        gridRow: 'auto',
      },
    };

    const cssResult = generateFlexboxGridCode({
      layoutMode: 'flex',
      codeFormat: 'css',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexGap: 16,
      gridCols: 'repeat(3, 1fr)',
      gridRows: 'auto',
      justifyItems: 'stretch',
      alignItemsGrid: 'stretch',
      gridGap: 16,
      itemCount: 2,
      itemStyles: customStyles,
    });

    expect(cssResult).toContain('.item-1 {');
    expect(cssResult).toContain('flex-grow: 2;');
    expect(cssResult).toContain('flex-shrink: 0;');
    expect(cssResult).toContain('align-self: center;');

    const tailwindResult = generateFlexboxGridCode({
      layoutMode: 'grid',
      codeFormat: 'tailwind',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      flexGap: 16,
      gridCols: 'repeat(3, 1fr)',
      gridRows: 'auto',
      justifyItems: 'stretch',
      alignItemsGrid: 'stretch',
      gridGap: 16,
      itemCount: 2,
      itemStyles: customStyles,
    });

    expect(tailwindResult).toContain('className="col-span-2 row-span-2"');
  });
});
