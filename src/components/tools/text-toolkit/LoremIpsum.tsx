'use client';

import { useState, useMemo } from 'react';
import { Clipboard, Check, Shuffle } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

import { LOREM_TEXTS, TextType, UnitType, pseudoRandom } from './lorem-ipsum-data';

function getShuffledIndices(length: number, trigger: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const seed = trigger * 1000 + i;
    const j = Math.floor(pseudoRandom(seed) * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export default function LoremIpsum() {
  const [textType, setTextType] = useState<TextType>('lorem');
  const [unit, setUnit] = useState<UnitType>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [htmlMarkup, setHtmlMarkup] = useState(false);
  const { copied, copy } = useCopyToClipboard();
  const [trigger, setTrigger] = useState(0);

  const generatedText = useMemo(() => {
    const activeText = LOREM_TEXTS[textType];
    const items: string[] = [];

    if (unit === 'paragraphs') {
      // パラグラフの生成
      const srcParas = activeText.paragraphs;
      const shuffled = getShuffledIndices(srcParas.length, trigger);
      for (let i = 0; i < count; i++) {
        items.push(srcParas[shuffled[i % srcParas.length]]);
      }
      if (htmlMarkup) {
        return items.map((p) => `<p>${p}</p>`).join('\n\n');
      } else {
        return items.join('\n\n');
      }
    } else if (unit === 'sentences') {
      // 一文の生成
      const srcSentences =
        'sentences' in activeText
          ? activeText.sentences
          : activeText.paragraphs.flatMap((p) => p.split(/(?<=[。\?\.])/)); // 簡易分割
      const filteredSentences = srcSentences.map((s) => s.trim()).filter(Boolean);
      const shuffled = getShuffledIndices(filteredSentences.length, trigger);

      for (let i = 0; i < count; i++) {
        items.push(filteredSentences[shuffled[i % filteredSentences.length]]);
      }
      const text = items.join(textType === 'lorem' ? ' ' : '');
      if (htmlMarkup) {
        return `<p>${text}</p>`;
      } else {
        return text;
      }
    } else if (unit === 'words') {
      // 単語または文字数の生成
      if (textType === 'lorem') {
        const srcWords = LOREM_TEXTS.lorem.words;
        for (let i = 0; i < count; i++) {
          const seed = trigger * 1000 + i;
          items.push(srcWords[Math.floor(pseudoRandom(seed) * srcWords.length)]);
        }
        // 文頭を大文字にする
        if (items.length > 0) {
          items[0] = items[0].charAt(0).toUpperCase() + items[0].slice(1);
        }
        const text = items.join(' ') + '.';
        if (htmlMarkup) {
          return `<p>${text}</p>`;
        } else {
          return text;
        }
      } else {
        // 日本語の場合は「文字数」として扱う
        const srcParas = activeText.paragraphs;
        const shuffled = getShuffledIndices(srcParas.length, trigger);
        let combinedText = shuffled.map((idx) => srcParas[idx]).join('');
        while (combinedText.length < count) {
          const nextTrigger = trigger + Math.floor(combinedText.length / 100) + 1;
          const nextShuffled = getShuffledIndices(srcParas.length, nextTrigger);
          combinedText += nextShuffled.map((idx) => srcParas[idx]).join('');
        }
        let text = combinedText.slice(0, count);
        // 最後の文字が句点等でない場合は適宜補正
        if (!text.endsWith('。') && !text.endsWith('、') && text.length > 0) {
          text = text.slice(0, count - 1) + '。';
        }
        if (htmlMarkup) {
          return `<p>${text}</p>`;
        } else {
          return text;
        }
      }
    } else if (unit === 'list') {
      // 箇条書き
      const srcSentences =
        'sentences' in activeText
          ? activeText.sentences
          : activeText.paragraphs.flatMap((p) => p.split(/(?<=[。\?\.])/));
      const filteredSentences = srcSentences
        .map((s) => s.trim().replace(/[。\.]$/, ''))
        .filter(Boolean);
      const shuffled = getShuffledIndices(filteredSentences.length, trigger);

      for (let i = 0; i < count; i++) {
        items.push(filteredSentences[shuffled[i % filteredSentences.length]]);
      }

      if (htmlMarkup) {
        return `<ul>\n${items.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`;
      } else {
        return items.map((item) => `- ${item}`).join('\n');
      }
    }
    return '';
  }, [textType, unit, count, htmlMarkup, trigger]);

  const handleCopy = () => {
    copy(generatedText);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左カラム: 設定パネル */}
        <div className="lg:col-span-4 space-y-6">
          <div className="theme-card p-5 md:p-6 space-y-5">
            <h2 className="text-base font-bold text-text border-b-2 border-border pb-2">
              ⚙️ ジェネレーター設定
            </h2>

            {/* テキストソース */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">テキスト素材</label>
              <select
                value={textType}
                onChange={(e) => {
                  const val = e.target.value as TextType;
                  setTextType(val);
                }}
                className="w-full px-3 py-2 border-2 border-border rounded-xl font-bold bg-card text-text focus:outline-none cursor-pointer text-sm"
              >
                {Object.entries(LOREM_TEXTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 生成単位 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">単位</label>
              <div className="grid grid-cols-2 gap-2">
                {(['paragraphs', 'sentences', 'words', 'list'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setUnit(u);
                      if (u === 'words' && textType !== 'lorem' && count < 20) {
                        setCount(100);
                      }
                    }}
                    className={`px-2 py-2 rounded-lg border-2 border-border text-xs font-bold cursor-pointer transition-all ${
                      unit === u
                        ? 'bg-accent text-white shadow-none translate-x-[1px] translate-y-[1px]'
                        : 'bg-card text-text shadow-[2px_2px_0px_0px_var(--border)] dark:shadow-[2px_2px_0px_0px_var(--accent)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0'
                    }`}
                  >
                    {u === 'paragraphs' && '段落 (p)'}
                    {u === 'sentences' && '文 (sentence)'}
                    {u === 'words' && (textType === 'lorem' ? '単語 (word)' : '文字数 (char)')}
                    {u === 'list' && 'リスト (li)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 数量 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-text/70">
                数量 ({unit === 'words' && textType !== 'lorem' ? '文字' : '個'})
              </label>
              <input
                type="number"
                min={1}
                max={unit === 'words' && textType !== 'lorem' ? 2000 : 100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border-2 border-border rounded-xl font-bold bg-card text-text focus:outline-none text-sm"
              />
            </div>

            {/* HTMLタグの有無 */}
            <label className="flex items-center gap-2.5 cursor-pointer py-1.5">
              <input
                type="checkbox"
                checked={htmlMarkup}
                onChange={(e) => setHtmlMarkup(e.target.checked)}
                className="w-4 h-4 border-2 border-border rounded accent-accent bg-card"
              />
              <span className="text-xs font-extrabold text-text">HTMLタグを含める</span>
            </label>

            {/* 再生成ボタン */}
            <button
              onClick={() => setTrigger((t) => t + 1)}
              className="w-full theme-btn py-2.5 bg-secondary text-text text-sm flex items-center justify-center gap-1.5"
            >
              <Shuffle className="w-4 h-4" />
              ランダムに再生成
            </button>
          </div>
        </div>

        {/* 右カラム: 生成コード出力 */}
        <div className="lg:col-span-8">
          <div className="theme-card p-5 md:p-6 flex flex-col h-full min-h-[480px]">
            <div className="flex justify-between items-center mb-4 border-b-2 border-border pb-3">
              <h2 className="text-base font-bold text-text">✨ 生成されたダミーテキスト</h2>
              {generatedText && (
                <button
                  onClick={handleCopy}
                  className="theme-btn px-4 py-1.5 text-xs bg-accent text-white flex items-center gap-1.5 cursor-pointer"
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
                className="w-full h-full p-4 border-2 border-border rounded-xl font-mono text-sm bg-card text-text focus:outline-none resize-none overflow-y-auto leading-relaxed"
                value={generatedText}
                placeholder="ここにテキストが生成されます。"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
