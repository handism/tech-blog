'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Clipboard, Trash2, Check, AlertTriangle, Info } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

// 特殊文字の定義
import { SpecialCharDef, SPECIAL_CHARS } from './invisible-characters-data';

export default function InvisibleCharacterDetector() {
  const [inputText, setInputText] = useState('');
  const { copied, copy } = useCopyToClipboard();

  // 各種クリーンアップトグル
  const [cleanFullWidthSpace, setCleanFullWidthSpace] = useState(true);
  const [cleanZeroWidthSpaces, setCleanZeroWidthSpaces] = useState(true);
  const [cleanBOM, setCleanBOM] = useState(true);
  const [cleanNBSP, setCleanNBSP] = useState(true);
  const [cleanControls, setCleanControls] = useState(true);

  // 検出された文字のカウント
  const detectionStats = useMemo(() => {
    const stats: Record<string, number> = {};
    let totalCount = 0;

    SPECIAL_CHARS.forEach((char) => {
      const matches = inputText.match(char.regex);
      const count = matches ? matches.length : 0;
      stats[char.name] = count;
      totalCount += count;
    });

    return { stats, totalCount };
  }, [inputText]);

  // ハイライトプレビュー用にテキストを配列化してパース
  // シンプルな走査型パースで文字を分解
  const parsedPreview = useMemo(() => {
    if (!inputText) return null;

    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      const code = char.charCodeAt(0);

      // 個別に該当特殊文字があるか判定
      let matchedDef: SpecialCharDef | null = null;
      for (const def of SPECIAL_CHARS) {
        if (def.testRegex.test(char)) {
          matchedDef = def;
          break;
        }
      }

      if (matchedDef) {
        let label = matchedDef.name;
        if (char === '\u3000') label = '全角';
        else if (char === '\u200b') label = 'ZWSP';
        else if (char === '\u200c') label = 'ZWNJ';
        else if (char === '\u200d') label = 'ZWJ';
        else if (char === '\ufeff') label = 'BOM';
        else if (char === '\u00a0') label = 'NBSP';
        else label = `Ctrl(0x${code.toString(16).toUpperCase()})`;

        elements.push(
          <span
            key={key++}
            className={`inline-flex items-center mx-0.5 px-1 text-[10px] font-black rounded cursor-help select-all ${matchedDef.className}`}
            title={`${matchedDef.name} (${matchedDef.hex})\n${matchedDef.description}`}
          >
            {label}
          </span>
        );
      } else {
        // 改行や通常のテキスト
        if (char === '\n') {
          elements.push(<br key={key++} />);
        } else if (char === '\r') {
          // キャリッジリターンは単独ならbrにせず無視するか可視化
          // 通常は表示しない
        } else {
          elements.push(
            <span key={key++} className="font-mono">
              {char}
            </span>
          );
        }
      }
    }

    return elements;
  }, [inputText]);

  // クリーンアップテキストの生成
  const cleanedText = useMemo(() => {
    let text = inputText;

    if (cleanFullWidthSpace) {
      // 全角スペースを半角スペース2つに置換
      text = text.replace(/\u3000/g, '  ');
    }
    if (cleanZeroWidthSpaces) {
      text = text.replace(/[\u200b\u200c\u200d]/g, '');
    }
    if (cleanBOM) {
      text = text.replace(/\ufeff/g, '');
    }
    if (cleanNBSP) {
      // NBSPを半角スペースに置換
      text = text.replace(/\u00a0/g, ' ');
    }
    if (cleanControls) {
      // 制御文字の削除
      text = text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
    }

    return text;
  }, [inputText, cleanFullWidthSpace, cleanZeroWidthSpaces, cleanBOM, cleanNBSP, cleanControls]);

  // コピー
  const handleCopyCleaned = () => {
    copy(cleanedText);
  };

  // 全て削除
  const handleClear = () => {
    setInputText('');
  };

  // サンプルテキスト適用
  const applySample = () => {
    // 意図的に不可視文字を混入したJavaScriptコード
    const sample = [
      '// ⚠️ このコードには不可視文字や全角スペースが混入しています',
      'function helloWorld() {',
      '  const message = "Hello";' + String.fromCharCode(0x3000) + '// 行末に全角スペース',
      '  const' +
        String.fromCharCode(0x200b) +
        ' hiddenSecret = "ZWSP"; // 変数名の前にゼロ幅スペース(ZWSP)',
      '  ' +
        String.fromCharCode(0x200c) +
        'console.log(message + ' +
        String.fromCharCode(0x00a0) +
        '" World"); // consoleの前にZWNJ、スペースにNBSP',
      '}',
    ].join('\n');
    setInputText(sample);
  };

  return (
    <ToolPageLayout
      title="Invisible Character Detector"
      description="コピペしたコードやテキストに含まれる「全角スペース」「ゼロ幅スペース」などの不可視文字や特殊スペースを検知して可視化します。プログラムの構文エラーや予期せぬパースエラーを防ぐために、ワンクリックで除去できます。"
      icon={Search}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：入力 & クリーンアップ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="theme-card p-5 bg-card border-2 border-border space-y-4">
            <div className="flex justify-between items-center">
              <label
                htmlFor="raw-textarea"
                className="text-sm font-extrabold flex items-center gap-1.5"
              >
                <span>📝</span> 対象テキストを入力
              </label>
              <div className="flex gap-2">
                <button
                  onClick={applySample}
                  className="px-2.5 py-1 text-[10px] font-bold border border-border rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  サンプルを試す
                </button>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="クリア"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              id="raw-textarea"
              placeholder="ここにコードやテキストを貼り付けてください..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 p-4 font-mono text-xs border-2 border-border rounded-xl bg-secondary text-text resize-y focus:outline-none"
            />
          </div>

          {/* クリーンアップオプション */}
          <div className="theme-card p-5 bg-card border-2 border-border space-y-4">
            <h3 className="text-sm font-extrabold border-b border-border/10 pb-2">
              🧽 クリーンアップ設定
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanFullWidthSpace}
                  onChange={(e) => setCleanFullWidthSpace(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <span>全角スペースを半角スペース2つに変換</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanZeroWidthSpaces}
                  onChange={(e) => setCleanZeroWidthSpaces(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <span>ゼロ幅スペース (ZWSP/ZWNJ/ZWJ) を削除</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanBOM}
                  onChange={(e) => setCleanBOM(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <span>BOM (バイト順マーク) を削除</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cleanNBSP}
                  onChange={(e) => setCleanNBSP(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <span>NBSP (改行なしスペース) を半角スペースに変換</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer md:col-span-2">
                <input
                  type="checkbox"
                  checked={cleanControls}
                  onChange={(e) => setCleanControls(e.target.checked)}
                  className="w-4 h-4 rounded accent-accent cursor-pointer"
                />
                <span>その他の不要な制御文字を削除</span>
              </label>
            </div>

            <div className="pt-3 border-t border-border/10 flex justify-end">
              <button
                onClick={handleCopyCleaned}
                disabled={!inputText}
                className="theme-btn px-5 py-2.5 bg-accent text-white flex items-center gap-2 text-xs font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Clipboard className="w-4 h-4" />
                )}
                <span>
                  {copied ? 'クリーンアップ後にコピー完了！' : 'クリーンアップしてコピー'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 右側：可視化プレビュー & 統計 */}
        <div className="lg:col-span-5 space-y-6">
          {/* 特殊文字検出統計 */}
          <div className="theme-card p-5 bg-card border-2 border-border space-y-4">
            <h3 className="text-sm font-extrabold border-b border-border/10 pb-2 flex items-center justify-between">
              <span>📊 検出統計</span>
              {detectionStats.totalCount > 0 ? (
                <span className="text-xs bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-black flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  問題あり (計 {detectionStats.totalCount} 箇所)
                </span>
              ) : (
                <span className="text-xs bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-black">
                  問題なし (0 箇所)
                </span>
              )}
            </h3>

            <div className="divide-y divide-border/10 text-xs">
              {SPECIAL_CHARS.map((char) => {
                const count = detectionStats.stats[char.name] || 0;
                return (
                  <div
                    key={char.name}
                    className="py-2.5 flex justify-between items-center font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full inline-block ${char.className.split(' ')[0]}`}
                      />
                      <span>{char.name}</span>
                      <span className="text-[10px] text-text/40 font-mono">({char.hex})</span>
                    </span>
                    <span className={count > 0 ? 'text-red-500 font-extrabold' : 'text-text/40'}>
                      {count} 件
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 可視化ハイライトプレビュー */}
          <div className="theme-card p-5 bg-card border-2 border-border space-y-3">
            <h3 className="text-sm font-extrabold flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>可視化ハイライト</span>
            </h3>
            <div className="p-4 bg-secondary rounded-xl border border-border min-h-[160px] max-h-[300px] overflow-y-auto font-mono text-xs whitespace-pre-wrap break-all leading-relaxed">
              {inputText ? (
                parsedPreview
              ) : (
                <div className="text-text/40 text-center py-10 font-bold flex flex-col items-center gap-2">
                  <Info className="w-8 h-8 opacity-40" />
                  テキストを入力すると、ここにハイライトされたプレビューが表示されます。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
