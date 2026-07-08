// src/components/tools/data-json/CsvJson.tsx
'use client';

import { useState } from 'react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(value);
      value = '';
    } else {
      value += char;
    }
  }

  result.push(value);
  return result;
};

const csvToJson = (text: string) => {
  const rows = text.trim().split(/\r?\n/).filter(Boolean);
  if (rows.length === 0) {
    return '[]';
  }

  const headers = parseCsvLine(rows[0]);
  const items = rows.slice(1).map((row) => {
    const values = parseCsvLine(row);
    return headers.reduce<Record<string, string>>((acc, key, index) => {
      acc[key] = values[index] ?? '';
      return acc;
    }, {});
  });

  return JSON.stringify(items, null, 2);
};

const jsonToCsv = (text: string) => {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error('JSON は配列である必要があります');
  }

  const headers = Array.from(
    new Set(data.flatMap((item) => (item && typeof item === 'object' ? Object.keys(item) : [])))
  );

  const escapeField = (value: unknown) => {
    const field = String(value ?? '');
    if (/[",\n]/.test(field)) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  const lines = [headers.join(',')];
  for (const item of data) {
    lines.push(headers.map((key) => escapeField(item?.[key])).join(','));
  }

  return lines.join('\n');
};

export default function CsvJson() {
  const { copy } = useCopyToClipboard();
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      setError('');
      const result = mode === 'csv-to-json' ? csvToJson(input) : jsonToCsv(input);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '変換に失敗しました');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    copy(output);
  };

  return (
    <div className="space-y-6">
      {/* モード選択 */}
      <div className="flex flex-wrap gap-6 items-center p-4 bg-secondary border-2 border-border rounded-xl shadow-[2px_2px_0px_0px_var(--border)]">
        <label className="flex items-center gap-2 text-text font-bold cursor-pointer select-none">
          <input
            type="radio"
            name="mode"
            value="csv-to-json"
            checked={mode === 'csv-to-json'}
            onChange={() => setMode('csv-to-json')}
            className="w-4 h-4 text-accent border-2 border-border rounded-full focus:ring-0 accent-accent"
          />
          CSV → JSON
        </label>
        <label className="flex items-center gap-2 text-text font-bold cursor-pointer select-none">
          <input
            type="radio"
            name="mode"
            value="json-to-csv"
            checked={mode === 'json-to-csv'}
            onChange={() => setMode('json-to-csv')}
            className="w-4 h-4 text-accent border-2 border-border rounded-full focus:ring-0 accent-accent"
          />
          JSON → CSV
        </label>
      </div>

      {/* 入出力エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-text mb-2">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'csv-to-json' ? 'name,age\nAlice,30' : '[{ "name": "Alice", "age": 30 }]'
            }
            className="w-full h-80 px-4 py-3 border-2 border-border bg-card text-text font-mono text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none shadow-[2px_2px_0px_0px_var(--border)]"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-text">出力</label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)] font-bold"
              >
                コピー
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 px-4 py-3 border-2 border-border bg-secondary text-text font-mono text-sm rounded-xl resize-none shadow-[2px_2px_0px_0px_var(--border)]"
          />
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
          <p>エラー: {error}</p>
        </div>
      )}

      {/* アクションボタン */}
      <button
        onClick={handleConvert}
        className="theme-btn bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] font-bold px-6 py-3 text-base cursor-pointer"
      >
        変換する
      </button>
    </div>
  );
}
