'use client';

import { Trash2, AlignLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import CopyButton from '@/src/components/CopyButton';

// Case helper functions
export function toWords(str: string): string[] {
  if (!str) return [];
  // Split camel, snake, kebab, or spaces
  const clean = str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camel
    .replace(/[_\-]+/g, ' ') // replace snake/kebab
    .replace(/\s+/g, ' ')
    .trim();
  return clean.split(' ').filter(Boolean);
}

export function toCamelCase(str: string): string {
  const words = toWords(str);
  if (words.length === 0) return '';
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('')
  );
}

export function toPascalCase(str: string): string {
  const words = toWords(str);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toSnakeCase(str: string): string {
  const words = toWords(str);
  return words.map((w) => w.toLowerCase()).join('_');
}

export function toKebabCase(str: string): string {
  const words = toWords(str);
  return words.map((w) => w.toLowerCase()).join('-');
}

export function toConstantCase(str: string): string {
  const words = toWords(str);
  return words.map((w) => w.toUpperCase()).join('_');
}

export function toTitleCase(str: string): string {
  const words = toWords(str);
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function toSentenceCase(str: string): string {
  const words = toWords(str);
  if (words.length === 0) return '';
  const first = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
  const rest = words
    .slice(1)
    .map((w) => w.toLowerCase())
    .join(' ');
  return first + (rest ? ' ' + rest : '');
}

export default function TextCase() {
  const [input, setInput] = useState('');

  // Compute stats in real-time
  const stats = useMemo(() => {
    if (!input) {
      return { charsWithSpace: 0, charsNoSpace: 0, words: 0, lines: 0, paragraphs: 0, bytes: 0 };
    }

    const charsWithSpace = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;

    // Split by word boundaries
    const words = input.trim().split(/\s+/).filter(Boolean).length;

    const lines = input.split('\n').length;
    const paragraphs = input.split(/\n\s*\n/).filter(Boolean).length;

    let bytes = 0;
    try {
      bytes = new TextEncoder().encode(input).length;
    } catch {
      bytes = charsWithSpace; // fallback
    }

    return { charsWithSpace, charsNoSpace, words, lines, paragraphs, bytes };
  }, [input]);

  // Compute all case transformations
  const cases = useMemo(() => {
    if (!input.trim()) return [];

    return [
      { label: 'lowercase', value: input.toLowerCase(), key: 'lower' },
      { label: 'UPPERCASE', value: input.toUpperCase(), key: 'upper' },
      { label: 'camelCase', value: toCamelCase(input), key: 'camel' },
      { label: 'PascalCase', value: toPascalCase(input), key: 'pascal' },
      { label: 'snake_case', value: toSnakeCase(input), key: 'snake' },
      { label: 'kebab-case', value: toKebabCase(input), key: 'kebab' },
      { label: 'CONSTANT_CASE', value: toConstantCase(input), key: 'constant' },
      { label: 'Title Case', value: toTitleCase(input), key: 'title' },
      { label: 'Sentence Case', value: toSentenceCase(input), key: 'sentence' },
    ];
  }, [input]);

  const handleClear = () => {
    setInput('');
  };

  return (
    <>
      {/* Header */}

      <div className="space-y-6">
        {/* Input textarea */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider">
              入力テキスト
            </label>
            {input && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-red-500 hover:underline font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                クリア
              </button>
            )}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにテキストを入力またはペースト..."
            className="w-full h-40 p-4 border-2 border-border bg-card text-text rounded-xl focus:outline-none font-mono text-sm resize-y transition"
          />
        </div>

        {/* Live Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              文字数 (空白含む)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.charsWithSpace}</span>
          </div>
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              文字数 (空白除く)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.charsNoSpace}</span>
          </div>
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              単語数 (Words)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.words}</span>
          </div>
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              行数 (Lines)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.lines}</span>
          </div>
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              段落数 (Paragraphs)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.paragraphs}</span>
          </div>
          <div className="theme-card p-3 text-center">
            <span className="text-[10px] font-bold text-text/50 uppercase block mb-1">
              サイズ (Bytes)
            </span>
            <span className="font-mono text-lg font-bold text-text">{stats.bytes}</span>
          </div>
        </div>

        {/* Case Transformations Panel */}
        {cases.length > 0 && (
          <div className="space-y-4 pt-4 border-t-2 border-border">
            <div className="flex items-center gap-1.5">
              <AlignLeft className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-text">ケース変換一覧</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map((c) => (
                <div
                  key={c.key}
                  className="theme-card p-4 flex items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-accent uppercase block mb-1">
                      {c.label}
                    </span>
                    <span className="font-mono text-sm text-text select-all break-all line-clamp-2">
                      {c.value || (
                        <em className="text-text/40 text-xs">変換エラーまたは文字列なし</em>
                      )}
                    </span>
                  </div>

                  {c.value && (
                    <CopyButton
                      value={c.value}
                      label=""
                      copiedLabel=""
                      className="shrink-0 theme-btn p-2 bg-secondary text-text relative cursor-pointer"
                      title="コピー"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Explanation box */}
        <div className="theme-card p-6">
          <h3 className="font-bold text-text mb-2">UTF-8バイトサイズ計測について</h3>
          <p className="text-sm text-text/60 leading-relaxed">
            半角英数字（ASCII）は1文字1バイトですが、日本語のひらがな・カタカナ・漢字・全角記号などは1文字あたり基本的に3バイトとして計算されます。
            また、絵文字（マルチバイト文字）は4バイト以上になることが多く、DBのカラム容量制限をチェックするのに本ツールのByteサイズ計算が威力を発揮します。
          </p>
        </div>
      </div>
    </>
  );
}
