// src/components/tools/data-json/CsvJson.tsx
'use client';

import { useState } from 'react';
import CopyButton from '@/src/components/CopyButton';

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

  return (
    <div className="space-y-6">
      {/* モード切り替え & 変換ボタン */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setMode('csv-to-json')}
          className={`flex-1 py-2.5 px-4 font-bold rounded-xl transition border-2 border-border ${
            mode === 'csv-to-json' ? 'bg-accent text-white border-accent' : 'bg-card text-text'
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => setMode('json-to-csv')}
          className={`flex-1 py-2.5 px-4 font-bold rounded-xl transition border-2 border-border ${
            mode === 'json-to-csv' ? 'bg-accent text-white border-accent' : 'bg-card text-text'
          }`}
        >
          JSON → CSV
        </button>
        <button onClick={handleConvert} className="theme-btn px-6 py-2.5 font-bold">
          変換実行
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
          エラー: {error}
        </div>
      )}

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
            className="theme-textarea w-full h-80 font-mono text-sm resize-none"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-text">出力</label>
            {output && (
              <CopyButton
                value={output}
                className="theme-btn px-3 py-1 text-xs shadow-[2px_2px_0px_0px_var(--border)] font-bold"
              />
            )}
          </div>
          <textarea
            value={output}
            readOnly
            className="theme-textarea w-full h-80 bg-secondary font-mono text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}
