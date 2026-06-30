'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { FileJson } from 'lucide-react';
import { useState } from 'react';
import YAML from 'js-yaml';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function YamlJsonConverter() {
  const { copy } = useCopyToClipboard();
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

  const copyToClipboard = () => {
    copy(output);
  };

  return (
    <ToolPageLayout
      title="YAML ↔ JSON コンバータ"
      description="YAMLとJSONを相互に変換します"
      icon={FileJson}
    >
      <div className="space-y-6">
        {/* ボタン */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConvert}
            className="flex-1 min-w-40 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {isYamlInput ? 'YAML → JSON' : 'JSON → YAML'} に変換
          </button>
          <button
            onClick={toggleMode}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            切り替え
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg">
            <p className="font-semibold">エラー:</p>
            <p className="text-sm font-mono break-all">{error}</p>
          </div>
        )}

        {/* 入出力エリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              入力 ({isYamlInput ? 'YAML' : 'JSON'})
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isYamlInput ? 'key: value\nlist:\n  - item1\n  - item2' : '{"key": "value"}'
              }
              className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white font-mono text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                出力 ({!isYamlInput ? 'YAML' : 'JSON'})
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
              className="w-full h-96 px-4 py-3 border border-slate-300 dark:border-slate-500 dark:bg-slate-700 dark:text-white font-mono text-sm rounded-lg bg-slate-50 dark:bg-slate-600 resize-none"
            />
          </div>
        </div>

        {/* 注記 */}
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg text-sm">
          <p>
            <strong>注:</strong>{' '}
            {isYamlInput
              ? 'YAML の日付や真偽値は JSON に変換時に自動でパースされます'
              : 'JSON から YAML への変換時、オブジェクトキーの順序は保持されます'}
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
