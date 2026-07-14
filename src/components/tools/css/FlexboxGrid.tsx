'use client';

import React, { useState, useMemo } from 'react';
import { Sliders, Layout, RefreshCw, Plus, Minus } from 'lucide-react';
import CopyButton from '@/src/components/CopyButton';

// アイテムの個別スタイル型
interface ItemStyle {
  id: number;
  flexGrow: number;
  flexShrink: number;
  alignSelf: React.CSSProperties['alignSelf'];
  gridColumn: string;
  gridRow: string;
}

export default function FlexboxGrid() {
  const [layoutMode, setLayoutMode] = useState<'flex' | 'grid'>('flex');
  const [itemCount, setItemCount] = useState(4);
  const [activeItemId, setActiveItemId] = useState<number | null>(null);

  // 個別アイテムスタイルの状態
  const [itemStyles, setItemStyles] = useState<Record<number, ItemStyle>>({
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
    3: {
      id: 3,
      flexGrow: 0,
      flexShrink: 1,
      alignSelf: 'auto',
      gridColumn: 'auto',
      gridRow: 'auto',
    },
    4: {
      id: 4,
      flexGrow: 0,
      flexShrink: 1,
      alignSelf: 'auto',
      gridColumn: 'auto',
      gridRow: 'auto',
    },
  });

  // コード出力のトグル（CSS vs Tailwind CSS）
  const [codeFormat, setCodeFormat] = useState<'css' | 'tailwind'>('css');

  // Flexbox設定
  const [flexDirection, setFlexDirection] = useState<
    'row' | 'row-reverse' | 'column' | 'column-reverse'
  >('row');
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>('wrap');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [alignContent, setAlignContent] = useState('stretch');
  const [flexGap, setFlexGap] = useState(16);

  // Grid設定
  const [gridCols, setGridCols] = useState('repeat(3, 1fr)');
  const [gridRows, setGridRows] = useState('auto');
  const [justifyItems, setJustifyItems] = useState('stretch');
  const [alignItemsGrid, setAlignItemsGrid] = useState('stretch');
  const [gridGap, setGridGap] = useState(16);

  // アイテム追加
  const handleAddItem = () => {
    if (itemCount >= 20) return;
    const newId = itemCount + 1;
    setItemCount(newId);
    setItemStyles((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'auto',
        gridColumn: 'auto',
        gridRow: 'auto',
      },
    }));
  };

  // アイテム削減
  const handleRemoveItem = () => {
    if (itemCount <= 1) return;
    const targetId = itemCount;
    setItemCount((prev) => prev - 1);
    if (activeItemId === targetId) {
      setActiveItemId(null);
    }
  };

  // 個別アイテムスタイルの変更
  const updateItemStyle = <K extends keyof ItemStyle>(
    id: number,
    field: K,
    value: ItemStyle[K]
  ) => {
    setItemStyles((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // すべてリセット
  const handleReset = () => {
    setFlexDirection('row');
    setFlexWrap('wrap');
    setJustifyContent('flex-start');
    setAlignItems('stretch');
    setAlignContent('stretch');
    setFlexGap(16);

    setGridCols('repeat(3, 1fr)');
    setGridRows('auto');
    setJustifyItems('stretch');
    setAlignItemsGrid('stretch');
    setGridGap(16);

    setItemCount(4);
    setActiveItemId(null);
    setItemStyles({
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
      3: {
        id: 3,
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'auto',
        gridColumn: 'auto',
        gridRow: 'auto',
      },
      4: {
        id: 4,
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'auto',
        gridColumn: 'auto',
        gridRow: 'auto',
      },
    });
  };

  // --- 生成コード計算 ---
  const generatedCode = useMemo(() => {
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
            (style.flexGrow !== 0 || style.flexShrink !== 1 || style.alignSelf !== 'auto')
          ) {
            itemCss += `
.item-${i} {
${style.flexGrow !== 0 ? `  flex-grow: ${style.flexGrow};\n` : ''}${style.flexShrink !== 1 ? `  flex-shrink: ${style.flexShrink};\n` : ''}${style.alignSelf !== 'auto' ? `  align-self: ${style.alignSelf};\n` : ''}}`;
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
              itemClasses.push(selfMap[style.alignSelf as string] || '');
            }
          }
          const itemClassStr =
            itemClasses.length > 0 ? ` className="${itemClasses.join(' ')}"` : '';
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
              // span 2などを col-span-2 などにマッピング
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
          const itemClassStr =
            itemClasses.length > 0 ? ` className="${itemClasses.join(' ')}"` : '';
          html += `  <div${itemClassStr}>Item ${i}</div>\n`;
        }
        html += `</div>`;
        return html;
      }
    }
  }, [
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
  ]);

  return (
    <>
      {/* レイアウト切り替えタブ */}
      <div className="flex justify-between items-center border-b-2 border-border mb-6">
        <div className="flex">
          <button
            onClick={() => {
              setLayoutMode('flex');
              setActiveItemId(null);
            }}
            className={`px-6 py-3 font-extrabold text-sm border-b-4 -mb-[2px] transition-all flex items-center gap-1.5 ${
              layoutMode === 'flex'
                ? 'border-accent text-accent'
                : 'border-transparent text-text/60'
            }`}
          >
            <span>👉</span> Flexbox
          </button>
          <button
            onClick={() => {
              setLayoutMode('grid');
              setActiveItemId(null);
            }}
            className={`px-6 py-3 font-extrabold text-sm border-b-4 -mb-[2px] transition-all flex items-center gap-1.5 ${
              layoutMode === 'grid'
                ? 'border-accent text-accent'
                : 'border-transparent text-text/60'
            }`}
          >
            <span>🍱</span> CSS Grid
          </button>
        </div>

        <button
          onClick={handleReset}
          className="theme-btn px-3 py-1.5 text-xs flex items-center gap-1 hover:text-accent font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>リセット</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：プレビュー ＆ コード出力 */}
        <div className="lg:col-span-8 space-y-6">
          {/* レイアウトプレビューエリア */}
          <div className="theme-card bg-secondary/30 dark:bg-card/20 p-6 min-h-[380px] flex flex-col justify-between border-2 border-border relative">
            <span className="absolute top-3 left-3 text-[10px] bg-black text-white px-2 py-0.5 rounded font-black uppercase tracking-widest opacity-60 z-10">
              Interactive Layout Preview
            </span>
            <span className="absolute top-3 right-3 text-[10px] text-text/50 font-bold z-10">
              カードクリックで個別プロパティ編集
            </span>

            {/* コンテナ本体 */}
            <div className="flex-1 flex items-center justify-center p-4">
              <div
                style={
                  layoutMode === 'flex'
                    ? {
                        display: 'flex',
                        flexDirection: flexDirection,
                        flexWrap: flexWrap,
                        justifyContent: justifyContent,
                        alignItems: alignItems,
                        alignContent: alignContent,
                        gap: `${flexGap}px`,
                        width: '100%',
                        minHeight: '260px',
                      }
                    : {
                        display: 'grid',
                        gridTemplateColumns: gridCols,
                        gridTemplateRows: gridRows,
                        justifyItems: justifyItems,
                        alignItems: alignItemsGrid,
                        gap: `${gridGap}px`,
                        width: '100%',
                        minHeight: '260px',
                      }
                }
                className="border-2 border-dashed border-border/40 p-4 rounded-2xl bg-card/60 transition-all duration-300"
              >
                {Array.from({ length: itemCount }).map((_, idx) => {
                  const id = idx + 1;
                  const customStyle = itemStyles[id] || {
                    flexGrow: 0,
                    flexShrink: 1,
                    alignSelf: 'auto',
                    gridColumn: 'auto',
                    gridRow: 'auto',
                  };
                  const isActive = activeItemId === id;

                  return (
                    <button
                      key={id}
                      onClick={() => setActiveItemId(isActive ? null : id)}
                      style={
                        layoutMode === 'flex'
                          ? {
                              flexGrow: customStyle.flexGrow,
                              flexShrink: customStyle.flexShrink,
                              alignSelf: customStyle.alignSelf,
                              minWidth: '70px',
                              minHeight: '50px',
                            }
                          : {
                              gridColumn: customStyle.gridColumn,
                              gridRow: customStyle.gridRow,
                              minWidth: '100%',
                              minHeight: '50px',
                            }
                      }
                      className={`
                        theme-card flex flex-col items-center justify-center p-3 text-center transition-all duration-300 select-none cursor-pointer
                        ${
                          isActive
                            ? 'bg-accent text-white border-accent scale-102 ring-4 ring-accent/25'
                            : 'bg-card text-text hover:bg-secondary/40 border-2 border-border'
                        }
                      `}
                    >
                      <span className="text-xs font-black">Item {id}</span>
                      {layoutMode === 'flex'
                        ? (customStyle.flexGrow > 0 || customStyle.alignSelf !== 'auto') && (
                            <span
                              className={`text-[8px] mt-1 opacity-70 font-mono ${isActive ? 'text-white' : 'text-accent'}`}
                            >
                              {customStyle.flexGrow > 0 ? `grow:${customStyle.flexGrow} ` : ''}
                              {customStyle.alignSelf !== 'auto'
                                ? `self:${customStyle.alignSelf}`
                                : ''}
                            </span>
                          )
                        : (customStyle.gridColumn !== 'auto' || customStyle.gridRow !== 'auto') && (
                            <span
                              className={`text-[8px] mt-1 opacity-70 font-mono ${isActive ? 'text-white' : 'text-accent'}`}
                            >
                              {customStyle.gridColumn !== 'auto'
                                ? `col:${customStyle.gridColumn} `
                                : ''}
                              {customStyle.gridRow !== 'auto' ? `row:${customStyle.gridRow}` : ''}
                            </span>
                          )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 個別アイテム編集パネル (プレビュー直下で開くインライン形式) */}
            {activeItemId !== null && (
              <div className="mt-4 p-4 bg-secondary/80 border-2 border-accent rounded-xl text-xs font-bold space-y-3 animation-fade-in z-20">
                <div className="flex justify-between items-center border-b border-border/10 pb-1.5">
                  <span className="text-accent font-black">
                    🔧 Item {activeItemId} の個別スタイル設定
                  </span>
                  <button
                    onClick={() => setActiveItemId(null)}
                    className="text-[10px] font-bold text-text/50 hover:text-text"
                  >
                    閉じる
                  </button>
                </div>

                {layoutMode === 'flex' ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span>flex-grow (伸長比)</span>
                      <select
                        value={itemStyles[activeItemId]?.flexGrow ?? 0}
                        onChange={(e) =>
                          updateItemStyle(activeItemId, 'flexGrow', Number(e.target.value))
                        }
                        className="w-full border border-border p-1.5 rounded bg-card text-[10px]"
                      >
                        <option value="0">0 (伸びない)</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span>flex-shrink (縮小比)</span>
                      <select
                        value={itemStyles[activeItemId]?.flexShrink ?? 1}
                        onChange={(e) =>
                          updateItemStyle(activeItemId, 'flexShrink', Number(e.target.value))
                        }
                        className="w-full border border-border p-1.5 rounded bg-card text-[10px]"
                      >
                        <option value="0">0 (縮まない)</option>
                        <option value="1">1 (デフォルト)</option>
                        <option value="2">2</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span>align-self (個別配置)</span>
                      <select
                        value={itemStyles[activeItemId]?.alignSelf ?? 'auto'}
                        onChange={(e) => updateItemStyle(activeItemId, 'alignSelf', e.target.value)}
                        className="w-full border border-border p-1.5 rounded bg-card text-[10px]"
                      >
                        <option value="auto">auto</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                        <option value="center">center</option>
                        <option value="stretch">stretch</option>
                        <option value="baseline">baseline</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span>grid-column (横結合/配置)</span>
                      <select
                        value={itemStyles[activeItemId]?.gridColumn ?? 'auto'}
                        onChange={(e) =>
                          updateItemStyle(activeItemId, 'gridColumn', e.target.value)
                        }
                        className="w-full border border-border p-1.5 rounded bg-card text-[10px]"
                      >
                        <option value="auto">auto (通常)</option>
                        <option value="span 2">2列結合 (span 2)</option>
                        <option value="span 3">3列結合 (span 3)</option>
                        <option value="1 / 3">グリッド線 1〜3</option>
                        <option value="2 / 4">グリッド線 2〜4</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span>grid-row (縦結合/配置)</span>
                      <select
                        value={itemStyles[activeItemId]?.gridRow ?? 'auto'}
                        onChange={(e) => updateItemStyle(activeItemId, 'gridRow', e.target.value)}
                        className="w-full border border-border p-1.5 rounded bg-card text-[10px]"
                      >
                        <option value="auto">auto (通常)</option>
                        <option value="span 2">2行結合 (span 2)</option>
                        <option value="span 3">3行結合 (span 3)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 生成コードエクスポート */}
          <div className="theme-card p-4 space-y-3 bg-card border-2 border-border">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setCodeFormat('css')}
                  className={`px-3 py-1.5 text-xs font-black border-2 border-border rounded-xl transition-all ${
                    codeFormat === 'css' ? 'bg-accent text-white' : 'bg-card text-text'
                  }`}
                >
                  Pure CSS
                </button>
                <button
                  onClick={() => setCodeFormat('tailwind')}
                  className={`px-3 py-1.5 text-xs font-black border-2 border-border rounded-xl transition-all ${
                    codeFormat === 'tailwind' ? 'bg-accent text-white' : 'bg-card text-text'
                  }`}
                >
                  Tailwind CSS HTML
                </button>
              </div>

              <CopyButton
                value={generatedCode}
                label="コードをコピー"
                copiedLabel="コピーしました"
                iconClassName="w-4 h-4"
                copiedIconClassName="w-4 h-4 text-green-500"
                className="theme-btn px-4 py-1.5 text-xs flex items-center gap-1.5 font-bold"
              />
            </div>

            <textarea
              readOnly
              value={generatedCode}
              className="w-full h-36 p-3 font-mono text-[11px] border-2 border-border rounded-lg bg-secondary text-text resize-none focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* 右側：コントロールパネル */}
        <div className="lg:col-span-4 space-y-6">
          <div className="theme-card p-5 bg-card space-y-5 border-2 border-border text-xs font-bold">
            <h3 className="text-sm font-extrabold border-b-2 border-border pb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>レイアウト設定</span>
            </h3>

            {/* アイテム個数 */}
            <div className="space-y-2 border-b border-border/10 pb-3">
              <span className="block">表示アイテム数</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRemoveItem}
                  className="w-8 h-8 rounded-lg border border-border bg-secondary hover:bg-secondary/70 flex items-center justify-center font-bold"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-black w-8 text-center">{itemCount}</span>
                <button
                  onClick={handleAddItem}
                  className="w-8 h-8 rounded-lg border border-border bg-secondary hover:bg-secondary/70 flex items-center justify-center font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {layoutMode === 'flex' ? (
              // --- Flexbox 設定コントロール ---
              <div className="space-y-4">
                {/* flex-direction */}
                <div className="space-y-1">
                  <span>flex-direction</span>
                  <select
                    value={flexDirection}
                    onChange={(e) => setFlexDirection(e.target.value as typeof flexDirection)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="row">row (横並び)</option>
                    <option value="row-reverse">row-reverse</option>
                    <option value="column">column (縦並び)</option>
                    <option value="column-reverse">column-reverse</option>
                  </select>
                </div>

                {/* flex-wrap */}
                <div className="space-y-1">
                  <span>flex-wrap</span>
                  <select
                    value={flexWrap}
                    onChange={(e) => setFlexWrap(e.target.value as typeof flexWrap)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="nowrap">nowrap (折り返さない)</option>
                    <option value="wrap">wrap (折り返す)</option>
                    <option value="wrap-reverse">wrap-reverse</option>
                  </select>
                </div>

                {/* justify-content */}
                <div className="space-y-1">
                  <span>justify-content (主軸配置)</span>
                  <select
                    value={justifyContent}
                    onChange={(e) => setJustifyContent(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="flex-start">flex-start (左/上寄せ)</option>
                    <option value="flex-end">flex-end</option>
                    <option value="center">center (中央揃え)</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                    <option value="space-evenly">space-evenly</option>
                  </select>
                </div>

                {/* align-items */}
                <div className="space-y-1">
                  <span>align-items (交差軸配置)</span>
                  <select
                    value={alignItems}
                    onChange={(e) => setAlignItems(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="stretch">stretch (引き伸ばし)</option>
                    <option value="flex-start">flex-start</option>
                    <option value="flex-end">flex-end</option>
                    <option value="center">center (中央揃え)</option>
                    <option value="baseline">baseline</option>
                  </select>
                </div>

                {/* align-content */}
                <div className="space-y-1">
                  <span>align-content (複数行交差軸)</span>
                  <select
                    disabled={flexWrap === 'nowrap'}
                    value={alignContent}
                    onChange={(e) => setAlignContent(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="stretch">stretch</option>
                    <option value="flex-start">flex-start</option>
                    <option value="flex-end">flex-end</option>
                    <option value="center">center</option>
                    <option value="space-between">space-between</option>
                    <option value="space-around">space-around</option>
                  </select>
                </div>

                {/* gap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>gap (間隔)</span>
                    <span className="text-accent">{flexGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="4"
                    value={flexGap}
                    onChange={(e) => setFlexGap(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            ) : (
              // --- CSS Grid 設定コントロール ---
              <div className="space-y-4">
                {/* Columns */}
                <div className="space-y-1">
                  <span>grid-template-columns</span>
                  <select
                    value={gridCols}
                    onChange={(e) => setGridCols(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="repeat(3, 1fr)">3列均等 (3 columns)</option>
                    <option value="repeat(2, 1fr)">2列均等 (2 columns)</option>
                    <option value="repeat(4, 1fr)">4列均等 (4 columns)</option>
                    <option value="1fr 2fr 1fr">可変3列 (1fr 2fr 1fr)</option>
                    <option value="150px 1fr">固定＋可変 (150px 1fr)</option>
                    <option value="repeat(auto-fit, minmax(100px, 1fr))">自動 (auto-fit)</option>
                  </select>
                </div>

                {/* Rows */}
                <div className="space-y-1">
                  <span>grid-template-rows</span>
                  <select
                    value={gridRows}
                    onChange={(e) => setGridRows(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="auto">自動 (auto)</option>
                    <option value="repeat(2, minmax(60px, auto))">最小60px x 2行</option>
                  </select>
                </div>

                {/* justify-items */}
                <div className="space-y-1">
                  <span>justify-items (横方向のセル内配置)</span>
                  <select
                    value={justifyItems}
                    onChange={(e) => setJustifyItems(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="stretch">stretch (引き伸ばし)</option>
                    <option value="start">start (左寄せ)</option>
                    <option value="end">end</option>
                    <option value="center">center (中央寄せ)</option>
                  </select>
                </div>

                {/* align-items */}
                <div className="space-y-1">
                  <span>align-items (縦方向のセル内配置)</span>
                  <select
                    value={alignItemsGrid}
                    onChange={(e) => setAlignItemsGrid(e.target.value)}
                    className="w-full border-2 border-border p-2 rounded-lg bg-card focus:outline-none"
                  >
                    <option value="stretch">stretch (引き伸ばし)</option>
                    <option value="start">start (上寄せ)</option>
                    <option value="end">end</option>
                    <option value="center">center (中央寄せ)</option>
                  </select>
                </div>

                {/* gap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>gap (グリッド間隔)</span>
                    <span className="text-accent">{gridGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="4"
                    value={gridGap}
                    onChange={(e) => setGridGap(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
