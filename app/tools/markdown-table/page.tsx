'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useMemo } from 'react';
import {
  Grid,
  Plus,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Clipboard,
  Check,
  Import,
} from 'lucide-react';

type Alignment = 'left' | 'center' | 'right';

export default function MarkdownTablePage() {
  // テーブルデータの状態 (デフォルトはヘッダー1行 + データ2行 = 3x3)
  const [headers, setHeaders] = useState<string[]>(['商品名', '価格', '在庫数']);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'right', 'center']);
  const [rows, setRows] = useState<string[][]>([
    ['リンゴ', '150円', '25'],
    ['バナナ', '100円', '12'],
  ]);

  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // テーブルデータからMarkdownを生成する処理 (useMemo化)
  const outputMarkdown = useMemo(() => {
    let md = '';

    // ヘッダー行
    md += '| ' + headers.map((h) => h.trim() || ' ').join(' | ') + ' |\n';

    // セパレーター（アライメント指定）
    md +=
      '| ' +
      alignments
        .map((align) => {
          if (align === 'center') return ':---:';
          if (align === 'right') return '---:';
          return ':---';
        })
        .join(' | ') +
      ' |\n';

    // データ行
    rows.forEach((row) => {
      md += '| ' + row.map((cell) => cell.trim() || ' ').join(' | ') + ' |\n';
    });

    return md;
  }, [headers, alignments, rows]);

  // 行の追加
  const handleAddRow = () => {
    const newRow = Array(headers.length).fill('');
    setRows([...rows, newRow]);
  };

  // 行の削除
  const handleRemoveRow = (index: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  // 列の追加
  const handleAddColumn = () => {
    setHeaders([...headers, `列${headers.length + 1}`]);
    setAlignments([...alignments, 'left']);
    setRows(rows.map((row) => [...row, '']));
  };

  // 列の削除
  const handleRemoveColumn = (index: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== index));
    setAlignments(alignments.filter((_, i) => i !== index));
    setRows(rows.map((row) => row.filter((_, i) => i !== index)));
  };

  // ヘッダー値の変更
  const handleHeaderChange = (index: number, val: string) => {
    const updated = [...headers];
    updated[index] = val;
    setHeaders(updated);
  };

  // セル値の変更
  const handleCellChange = (rowIndex: number, colIndex: number, val: string) => {
    const updated = rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => (cIdx === colIndex ? val : cell));
      }
      return row;
    });
    setRows(updated);
  };

  // アライメントの変更
  const toggleAlignment = (colIndex: number) => {
    const order: Alignment[] = ['left', 'center', 'right'];
    const currentIdx = order.indexOf(alignments[colIndex]);
    const nextAlignment = order[(currentIdx + 1) % order.length];

    const updated = [...alignments];
    updated[colIndex] = nextAlignment;
    setAlignments(updated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Markdownテーブルをインポートしてパースする
  const handleImport = () => {
    setImportError('');
    if (!importText.trim()) return;

    try {
      const lines = importText
        .trim()
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('|') && l.endsWith('|'));

      if (lines.length < 2) {
        throw new Error('テーブル形式が正しくありません。行を | で囲んでください。');
      }

      // ヘッダー行の分解
      const parsedHeaders = lines[0]
        .slice(1, -1)
        .split('|')
        .map((s) => s.trim());

      const numCols = parsedHeaders.length;

      // セパレーター行（2行目）の解析とアライメントの抽出
      let parsedAlignments: Alignment[] = Array(numCols).fill('left');
      let dataStartIdx = 1;

      const isSeparator = lines[1].includes('-') && !lines[1].match(/[a-zA-Z0-9]/);
      if (isSeparator) {
        dataStartIdx = 2;
        parsedAlignments = lines[1]
          .slice(1, -1)
          .split('|')
          .map((s) => {
            const trimmed = s.trim();
            const startColon = trimmed.startsWith(':');
            const endColon = trimmed.endsWith(':');
            if (startColon && endColon) return 'center';
            if (endColon) return 'right';
            return 'left';
          });
      }

      // データ行の分解
      const parsedRows: string[][] = [];
      for (let i = dataStartIdx; i < lines.length; i++) {
        const rawCells = lines[i].slice(1, -1).split('|');
        const cells = Array(numCols).fill('');
        for (let c = 0; c < numCols; c++) {
          cells[c] = rawCells[c] ? rawCells[c].trim() : '';
        }
        parsedRows.push(cells);
      }

      // 状態の適用
      setHeaders(parsedHeaders);
      setAlignments(parsedAlignments);
      setRows(parsedRows.length > 0 ? parsedRows : [Array(numCols).fill('')]);
      setShowImport(false);
      setImportText('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setImportError(`インポート失敗: ${errMsg}`);
    }
  };

  return (
    <ToolPageLayout
      title="Markdown Table Editor"
      description="表計算ライクなUIで表を作成・編集し、綺麗なMarkdown形式のテーブルをエクスポートおよびインポートできます。"
      icon={Grid}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: エディタグリッド */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="theme-card p-5 md:p-6 space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b-2 border-border pb-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>📝 テーブル編集</span>
              </h2>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAddRow}
                  className="theme-btn px-2.5 py-1 text-xs bg-secondary flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 行追加
                </button>
                <button
                  onClick={handleAddColumn}
                  className="theme-btn px-2.5 py-1 text-xs bg-secondary flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> 列追加
                </button>
                <button
                  onClick={() => setShowImport(!showImport)}
                  className="theme-btn px-2.5 py-1 text-xs bg-card flex items-center gap-1"
                >
                  <Import className="w-3.5 h-3.5" /> インポート
                </button>
              </div>
            </div>

            {/* インポートテキストエリア */}
            {showImport && (
              <div className="p-4 border-2 border-dashed border-border/60 rounded-xl bg-secondary/20 space-y-3">
                <span className="text-xs font-bold text-text block">
                  Markdownの表を貼り付け (例: | A | B |)
                </span>
                <textarea
                  className="w-full h-[120px] p-3 border-2 border-border rounded-xl font-mono text-xs bg-card text-text focus:outline-none"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="| 商品名 | 価格 |&#10;| :--- | ---: |&#10;| リンゴ | 150円 |"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowImport(false)}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs font-bold bg-card"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleImport}
                    className="px-3 py-1.5 border-2 border-border rounded-lg text-xs font-bold bg-accent text-white"
                  >
                    適用
                  </button>
                </div>
                {importError && <p className="text-xs font-bold text-red-500">{importError}</p>}
              </div>
            )}

            {/* スプレッドシートテーブル */}
            <div className="overflow-x-auto border-2 border-border rounded-xl bg-card">
              <table className="min-w-full divide-y divide-border/30 table-fixed">
                <thead className="bg-secondary/40">
                  <tr>
                    {headers.map((hdr, colIdx) => (
                      <th key={colIdx} className="p-2 border-r border-border/20 min-w-[120px]">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-text/40 font-extrabold">
                              列 {colIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              {/* アライメント変更 */}
                              <button
                                onClick={() => toggleAlignment(colIdx)}
                                className="p-1 border border-border/40 rounded bg-card text-text/75 hover:bg-secondary"
                                title="位置合わせ切り替え"
                              >
                                {alignments[colIdx] === 'left' && <AlignLeft className="w-3 h-3" />}
                                {alignments[colIdx] === 'center' && (
                                  <AlignCenter className="w-3 h-3" />
                                )}
                                {alignments[colIdx] === 'right' && (
                                  <AlignRight className="w-3 h-3" />
                                )}
                              </button>
                              {/* 列の削除 */}
                              <button
                                onClick={() => handleRemoveColumn(colIdx)}
                                disabled={headers.length <= 1}
                                className="p-1 text-red-500 border border-border/40 rounded bg-card hover:bg-red-50 disabled:opacity-40"
                                title="列削除"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={hdr}
                            onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                            className="w-full px-2 py-1.5 border border-border/40 rounded-lg text-xs font-extrabold bg-card text-text text-center focus:outline-none"
                            placeholder="ヘッダー"
                          />
                        </div>
                      </th>
                    ))}
                    <th className="w-10 p-2 text-center" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-secondary/5">
                      {row.map((cell, colIdx) => (
                        <td key={colIdx} className="p-2 border-r border-border/10">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                            className={`w-full px-2 py-1.5 border border-border/10 rounded-lg text-xs font-medium bg-card text-text focus:outline-none ${
                              alignments[colIdx] === 'center'
                                ? 'text-center'
                                : alignments[colIdx] === 'right'
                                  ? 'text-right'
                                  : 'text-left'
                            }`}
                            placeholder="値"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleRemoveRow(rowIdx)}
                          disabled={rows.length <= 1}
                          className="p-1 text-red-500 rounded hover:bg-red-50 disabled:opacity-40"
                          title="行削除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 右カラム: エクスポート出力 */}
        <div className="lg:col-span-4">
          <div className="theme-card p-5 md:p-6 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-3">
              <h2 className="text-base font-bold text-text">⚡ Markdownエクスポート</h2>
              {outputMarkdown && (
                <button
                  onClick={handleCopy}
                  className="theme-btn px-3 py-1 text-xs bg-accent text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Clipboard className="w-3.5 h-3.5" />
                  )}
                  コピー
                </button>
              )}
            </div>

            <div className="flex-1 min-h-0">
              <textarea
                readOnly
                className="w-full h-full p-3 border-2 border-border rounded-xl font-mono text-xs bg-slate-950 text-slate-100 focus:outline-none resize-none overflow-y-auto whitespace-pre leading-relaxed"
                value={outputMarkdown}
                placeholder="テーブルのMarkdownが生成されます。"
              />
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
