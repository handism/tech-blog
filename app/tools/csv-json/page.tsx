'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Code } from 'lucide-react';
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

export default function CsvJsonConverter() {
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
    <ToolPageLayout title="CSV ↔ JSON Converter" icon={Code}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="mode"
              value="csv-to-json"
              checked={mode === 'csv-to-json'}
              onChange={() => setMode('csv-to-json')}
              className="w-4 h-4"
            />
            CSV → JSON
          </label>
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <input
              type="radio"
              name="mode"
              value="json-to-csv"
              checked={mode === 'json-to-csv'}
              onChange={() => setMode('json-to-csv')}
              className="w-4 h-4"
            />
            JSON → CSV
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              入力
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'csv-to-json' ? 'name,age\nAlice,30' : '[{ "name": "Alice", "age": 30 }]'
              }
              className="w-full h-64 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none font-mono text-sm"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                出力
              </label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-xs bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-800 dark:text-white px-3 py-1 rounded transition"
                >
                  コピー
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white rounded-lg bg-slate-50 dark:bg-slate-600 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={handleConvert}
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 px-5 rounded-lg transition"
        >
          変換
        </button>
      </div>
    </ToolPageLayout>
  );
}
