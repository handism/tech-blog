// src/components/tools/data-json/YamlJson.tsx
'use client';

import { useState } from 'react';
import YAML from 'js-yaml';
import CopyButton from '@/src/components/CopyButton';

export default function YamlJson() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isYamlInput, setIsYamlInput] = useState(true);

  const handleConvert = () => {
    try {
      setError('');
      if (isYamlInput) {
        // YAML to JSON
        const parsed = YAML.load(input) as Record<string, unknown>;
        const jsonOutput = JSON.stringify(parsed, null, 2);
        setOutput(jsonOutput);
      } else {
        // JSON to YAML
        const parsed = JSON.parse(input);
        const yamlOutput = YAML.dump(parsed, { indent: 2 });
        setOutput(yamlOutput);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コンバージョンエラー');
      setOutput('');
    }
  };

  const toggleMode = () => {
    setIsYamlInput(!isYamlInput);
    setInput(output);
    setOutput(input);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* ボタン */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          className="flex-1 min-w-[150px] py-3 text-base theme-btn bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] font-bold"
        >
          {isYamlInput ? 'YAML → JSON' : 'JSON → YAML'} に変換
        </button>
        <button onClick={toggleMode} className="theme-btn px-6 py-3 font-bold">
          切り替え
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl font-bold text-sm">
          <p>エラー: {error}</p>
        </div>
      )}

      {/* 入出力エリア */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-text mb-2">
            入力 ({isYamlInput ? 'YAML' : 'JSON'})
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isYamlInput ? 'key: value\nlist:\n  - item1\n  - item2' : '{"key": "value"}'
            }
            className="theme-textarea w-full h-96 font-mono text-sm resize-none"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-text">
              出力 ({!isYamlInput ? 'YAML' : 'JSON'})
            </label>
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
            className="theme-textarea w-full h-96 bg-secondary font-mono text-sm resize-none"
          />
        </div>
      </div>

      {/* 注記 */}
      <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)] text-sm">
        <p className="text-text/70 leading-relaxed font-medium">
          <strong>注:</strong>{' '}
          {isYamlInput
            ? 'YAML の日付や真偽値は JSON に変換時に自動でパースされます'
            : 'JSON から YAML への変換時、オブジェクトキーの順序は保持されます'}
        </p>
      </div>
    </div>
  );
}
