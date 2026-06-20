'use client';

import { useState } from 'react';
import { Database, Plus, Trash2, Copy, Check, Download, Play } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

type FieldType = 'id' | 'uuid' | 'name' | 'email' | 'date' | 'boolean' | 'number' | 'string';

interface Field {
  id: string;
  key: string;
  type: FieldType;
  min?: number;
  max?: number;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'id', label: 'ID (連番)' },
  { value: 'uuid', label: 'UUID v4' },
  { value: 'name', label: '名前' },
  { value: 'email', label: 'メールアドレス' },
  { value: 'date', label: '日付 (過去30日ランダム)' },
  { value: 'boolean', label: '真偽値 (Boolean)' },
  { value: 'number', label: '数値 (範囲指定)' },
  { value: 'string', label: '文字列 (ランダム単語)' },
];

const MOCK_NAMES = [
  'Aoki',
  'Sato',
  'Suzuki',
  'Takahashi',
  'Tanaka',
  'Watanabe',
  'Ito',
  'Yamamoto',
  'Nakamura',
  'Kobayashi',
  'Kato',
  'Yoshida',
  'Yamada',
];
const MOCK_DOMAINS = ['example.com', 'test.co.jp', 'mail.org', 'handism.net'];
const MOCK_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'development',
  'interface',
  'brutalism',
  'neon',
];

export default function MockJsonGenerator() {
  const [fields, setFields] = useState<Field[]>([
    { id: '1', key: 'id', type: 'id' },
    { id: '2', key: 'uuid', type: 'uuid' },
    { id: '3', key: 'name', type: 'name' },
    { id: '4', key: 'email', type: 'email' },
    { id: '5', key: 'isActive', type: 'boolean' },
    { id: '6', key: 'age', type: 'number', min: 18, max: 60 },
  ]);

  const [count, setCount] = useState(10);
  const [generatedJson, setGeneratedJson] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // フィールドの追加
  const addField = () => {
    const newId = Date.now().toString();
    setFields([...fields, { id: newId, key: `field_${fields.length + 1}`, type: 'string' }]);
  };

  // フィールドの削除
  const removeField = (id: string) => {
    if (fields.length <= 1) {
      alert('少なくとも1つのフィールドが必要です。');
      return;
    }
    setFields(fields.filter((f) => f.id !== id));
  };

  // フィールドの更新
  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  // データ生成処理
  const handleGenerate = () => {
    const dataList = [];

    for (let i = 0; i < count; i++) {
      const row: Record<string, string | number | boolean | null> = {};

      fields.forEach((field) => {
        const key = field.key.trim() || `field_${field.id}`;

        switch (field.type) {
          case 'id':
            row[key] = i + 1;
            break;
          case 'uuid':
            row[key] = crypto.randomUUID();
            break;
          case 'name':
            row[key] = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
            break;
          case 'email': {
            const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)].toLowerCase();
            const rand = Math.floor(Math.random() * 1000);
            const domain = MOCK_DOMAINS[Math.floor(Math.random() * MOCK_DOMAINS.length)];
            row[key] = `${name}${rand}@${domain}`;
            break;
          }
          case 'date': {
            const daysAgo = Math.random() * 30;
            const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            row[key] = date.toISOString().split('T')[0];
            break;
          }
          case 'boolean':
            row[key] = Math.random() > 0.5;
            break;
          case 'number': {
            const min = field.min ?? 0;
            const max = field.max ?? 100;
            row[key] = Math.floor(Math.random() * (max - min + 1)) + min;
            break;
          }
          case 'string':
            row[key] = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
            break;
          default:
            row[key] = null;
        }
      });

      dataList.push(row);
    }

    setGeneratedJson(JSON.stringify(dataList, null, 2));
  };

  const handleCopy = () => {
    if (!generatedJson) return;
    navigator.clipboard.writeText(generatedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedJson) return;
    const blob = new Blob([generatedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `mock-data-${Date.now()}.json`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      title="Mock JSON Data Generator"
      description="開発時のテストやAPIモックの構築に役立つダミーのJSONデータを瞬時に作成します。任意のデータ構造（スキーマ）を定義し、件数を選択して一括生成・ダウンロードできます。"
      icon={Database}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：スキーマ定義 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="theme-card p-5 bg-card space-y-5">
            <div className="flex justify-between items-center border-b-2 border-border pb-3">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <span>📋</span> スキーマ設計
              </h3>
              <div className="flex items-center gap-2">
                <label htmlFor="record-count" className="text-xs font-bold whitespace-nowrap">
                  件数:
                </label>
                <input
                  id="record-count"
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
                  className="w-16 border-2 border-border px-2 py-1 rounded bg-secondary text-xs font-black focus:outline-none"
                />
              </div>
            </div>

            {/* フィールド設定リスト */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex flex-wrap md:flex-nowrap items-center gap-2.5 p-3 bg-secondary rounded-xl border border-border/10"
                >
                  {/* キー名 */}
                  <input
                    type="text"
                    value={field.key}
                    placeholder="キー名 (e.g. name)"
                    onChange={(e) => updateField(field.id, { key: e.target.value })}
                    className="flex-1 min-w-[120px] border-2 border-border px-2 py-1.5 rounded bg-card text-xs font-bold focus:outline-none"
                  />

                  {/* タイプ */}
                  <select
                    value={field.type}
                    onChange={(e) => {
                      const newType = e.target.value as FieldType;
                      const updates: Partial<Field> = { type: newType };
                      if (newType === 'number') {
                        updates.min = 0;
                        updates.max = 100;
                      }
                      updateField(field.id, updates);
                    }}
                    className="border-2 border-border px-2 py-1.5 rounded bg-card text-xs font-bold focus:outline-none"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  {/* 数値の場合の範囲指定 */}
                  {field.type === 'number' && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="min"
                        value={field.min ?? 0}
                        onChange={(e) => updateField(field.id, { min: Number(e.target.value) })}
                        className="w-12 border-2 border-border px-1.5 py-1 rounded bg-card text-[10px] font-bold text-center"
                      />
                      <span className="text-[10px] font-bold text-text/40">~</span>
                      <input
                        type="number"
                        placeholder="max"
                        value={field.max ?? 100}
                        onChange={(e) => updateField(field.id, { max: Number(e.target.value) })}
                        className="w-12 border-2 border-border px-1.5 py-1 rounded bg-card text-[10px] font-bold text-center"
                      />
                    </div>
                  )}

                  {/* 削除ボタン */}
                  <button
                    onClick={() => removeField(field.id)}
                    className="p-1.5 text-red-500 border border-transparent hover:border-red-500 rounded bg-card transition-colors cursor-pointer"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={addField}
                className="flex-1 theme-btn px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 hover:text-accent"
              >
                <Plus className="w-4 h-4" />
                <span>フィールドを追加</span>
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 theme-btn bg-accent text-white px-4 py-2.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>データを生成する</span>
              </button>
            </div>
          </div>
        </div>

        {/* 右側：出力プレビュー */}
        <div className="lg:col-span-6 space-y-6">
          <div className="theme-card p-5 bg-card flex flex-col h-[480px]">
            <div className="flex justify-between items-center border-b-2 border-border pb-3 mb-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-text/60">
                JSON 出力プレビュー
              </h4>
              {generatedJson && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="theme-btn p-1.5 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'コピー済' : 'コピー'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="theme-btn p-1.5 text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DL</span>
                  </button>
                </div>
              )}
            </div>

            {generatedJson ? (
              <textarea
                readOnly
                value={generatedJson}
                className="w-full flex-1 p-3 font-mono text-xs border-2 border-border rounded-xl bg-[#1e1e1e] text-[#f8f8f2] resize-none focus:outline-none"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text/40 bg-secondary/30 border-2 border-dashed border-border/20 rounded-xl text-center p-6">
                <span className="text-3xl mb-2">📊</span>
                <p className="text-xs font-bold mb-1">左側で構造を設定して「生成」をクリック</p>
                <p className="text-[10px] text-text/50">数千件のランダムデータを数秒で構築します</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
