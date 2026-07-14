export interface ItemStyle {
  id: number;
  flexGrow: number;
  flexShrink: number;
  alignSelf: string;
  gridColumn: string;
  gridRow: string;
}

export interface GenerateFlexboxGridCodeParams {
  layoutMode: 'flex' | 'grid';
  codeFormat: 'css' | 'tailwind';
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  flexGap: number;
  gridCols: string;
  gridRows: string;
  justifyItems: string;
  alignItemsGrid: string;
  gridGap: number;
  itemCount: number;
  itemStyles: Record<number, ItemStyle>;
}

/**
 * Flexbox / Grid の設定から CSS または Tailwind CSS のコード文字列を生成します。
 */
export function generateFlexboxGridCode(params: GenerateFlexboxGridCodeParams): string {
  const {
    layoutMode,
    codeFormat,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    alignContent,
    flexGap,
    gridCols,
    gridRows,
    justifyItems,
    alignItemsGrid,
    gridGap,
    itemCount,
    itemStyles,
  } = params;

  const isFlex = layoutMode === 'flex';

  if (codeFormat === 'css') {
    // CSS フォーマット
    if (isFlex) {
      const css = `.container {
  display: flex;
  flex-direction: ${flexDirection};
  flex-wrap: ${flexWrap};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  align-content: ${alignContent};
  gap: ${flexGap}px;
}
`;
      // カスタム設定がある子要素のCSS
      let itemCss = '';
      for (let i = 1; i <= itemCount; i++) {
        const style = itemStyles[i];
        if (
          style &&
          (style.flexGrow !== 0 ||
            style.flexShrink !== 1 ||
            (style.alignSelf && style.alignSelf !== 'auto'))
        ) {
          itemCss += `
.item-${i} {
${style.flexGrow !== 0 ? `  flex-grow: ${style.flexGrow};\n` : ''}${style.flexShrink !== 1 ? `  flex-shrink: ${style.flexShrink};\n` : ''}${style.alignSelf && style.alignSelf !== 'auto' ? `  align-self: ${style.alignSelf};\n` : ''}}`;
        }
      }
      return css + itemCss;
    } else {
      const css = `.container {
  display: grid;
  grid-template-columns: ${gridCols};
  grid-template-rows: ${gridRows};
  justify-items: ${justifyItems};
  align-items: ${alignItemsGrid};
  gap: ${gridGap}px;
}
`;
      let itemCss = '';
      for (let i = 1; i <= itemCount; i++) {
        const style = itemStyles[i];
        if (style && (style.gridColumn !== 'auto' || style.gridRow !== 'auto')) {
          itemCss += `
.item-${i} {
${style.gridColumn !== 'auto' ? `  grid-column: ${style.gridColumn};\n` : ''}${style.gridRow !== 'auto' ? `  grid-row: ${style.gridRow};\n` : ''}}`;
        }
      }
      return css + itemCss;
    }
  } else {
    // Tailwind CSS フォーマット
    if (isFlex) {
      // マッピング
      const dirMap = {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        column: 'flex-col',
        'column-reverse': 'flex-col-reverse',
      };
      const wrapMap = {
        nowrap: 'flex-nowrap',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
      };
      const justifyMap: Record<string, string> = {
        'flex-start': 'justify-start',
        'flex-end': 'justify-end',
        center: 'justify-center',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly',
      };
      const itemsMap: Record<string, string> = {
        stretch: 'items-stretch',
        'flex-start': 'items-start',
        'flex-end': 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
      };
      const contentMap: Record<string, string> = {
        stretch: 'content-stretch',
        'flex-start': 'content-start',
        'flex-end': 'content-end',
        center: 'content-center',
        'space-between': 'content-between',
        'space-around': 'content-around',
      };

      const classes = [
        'flex',
        dirMap[flexDirection],
        wrapMap[flexWrap],
        justifyMap[justifyContent] || '',
        itemsMap[alignItems] || '',
        alignContent !== 'stretch' ? contentMap[alignContent] : '',
        `gap-[${flexGap}px]`,
      ]
        .filter(Boolean)
        .join(' ');

      let html = `<div className="${classes}">\n`;
      for (let i = 1; i <= itemCount; i++) {
        const style = itemStyles[i];
        const itemClasses = [];
        if (style) {
          if (style.flexGrow > 0) itemClasses.push(`grow-[${style.flexGrow}]`);
          if (style.flexShrink !== 1) itemClasses.push(`shrink-[${style.flexShrink}]`);
          if (style.alignSelf && style.alignSelf !== 'auto') {
            const selfMap: Record<string, string> = {
              'flex-start': 'self-start',
              'flex-end': 'self-end',
              center: 'self-center',
              stretch: 'self-stretch',
              baseline: 'self-baseline',
            };
            itemClasses.push(selfMap[style.alignSelf] || '');
          }
        }
        const itemClassStr = itemClasses.length > 0 ? ` className="${itemClasses.join(' ')}"` : '';
        html += `  <div${itemClassStr}>Item ${i}</div>\n`;
      }
      html += `</div>`;
      return html;
    } else {
      const justifyMap: Record<string, string> = {
        stretch: 'justify-items-stretch',
        start: 'justify-items-start',
        end: 'justify-items-end',
        center: 'justify-items-center',
      };
      const itemsMap: Record<string, string> = {
        stretch: 'items-stretch',
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
      };

      // コラム幅の簡易マッピング（1fr系のみ）
      let colsClass = `grid-cols-[${gridCols}]`;
      if (gridCols === 'repeat(3, 1fr)') colsClass = 'grid-cols-3';
      else if (gridCols === 'repeat(2, 1fr)') colsClass = 'grid-cols-2';
      else if (gridCols === 'repeat(4, 1fr)') colsClass = 'grid-cols-4';

      const classes = [
        'grid',
        colsClass,
        justifyItems !== 'stretch' ? justifyMap[justifyItems] : '',
        alignItemsGrid !== 'stretch' ? itemsMap[alignItemsGrid] : '',
        `gap-[${gridGap}px]`,
      ]
        .filter(Boolean)
        .join(' ');

      let html = `<div className="${classes}">\n`;
      for (let i = 1; i <= itemCount; i++) {
        const style = itemStyles[i];
        const itemClasses = [];
        if (style) {
          if (style.gridColumn !== 'auto') {
            const colSpan = style.gridColumn.match(/span\s+(\d+)/);
            if (colSpan) itemClasses.push(`col-span-${colSpan[1]}`);
            else itemClasses.push(`col-[${style.gridColumn}]`);
          }
          if (style.gridRow !== 'auto') {
            const rowSpan = style.gridRow.match(/span\s+(\d+)/);
            if (rowSpan) itemClasses.push(`row-span-${rowSpan[1]}`);
            else itemClasses.push(`row-[${style.gridRow}]`);
          }
        }
        const itemClassStr = itemClasses.length > 0 ? ` className="${itemClasses.join(' ')}"` : '';
        html += `  <div${itemClassStr}>Item ${i}</div>\n`;
      }
      html += `</div>`;
      return html;
    }
  }
}
