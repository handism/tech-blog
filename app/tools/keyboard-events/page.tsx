'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useState, useEffect } from 'react';
import { Keyboard, Trash2, ShieldAlert } from 'lucide-react';
import { usKeyboardRows, jisKeyboardRows } from './keyboard-data';

interface KeyHistoryItem {
  key: string;
  code: string;
  keyCode: number;
  timestamp: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}

export default function KeyboardEvents() {
  const [currentEvent, setCurrentEvent] = useState<KeyHistoryItem | null>(null);
  const [history, setHistory] = useState<KeyHistoryItem[]>([]);
  const [activeCodes, setActiveCodes] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<'us' | 'jis'>('us');
  /* const visualizerRef = useRef<HTMLDivElement>(null); */

  useEffect(() => {
    const savedLayout = localStorage.getItem('keyboard-layout');
    if (savedLayout === 'jis' || savedLayout === 'us') {
      requestAnimationFrame(() => {
        setLayout(savedLayout);
      });
    }
  }, []);

  const handleLayoutChange = (newLayout: 'us' | 'jis') => {
    setLayout(newLayout);
    localStorage.setItem('keyboard-layout', newLayout);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // InputフィールドやTextareaなどに入力中の場合はキャプチャするが、デフォルト挙動を妨げないようにする
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      // システムショートカット (Cmd+R, F12など) はブロックしない
      if (e.metaKey && (e.key === 'r' || e.key === 'R')) return;
      if (e.key === 'F12') return;

      // TabやBackspaceなどでデフォルトの挙動を防ぎたい場合（フォーカスが外れたりページ移動したりするのを防ぐ）
      if (
        !isInput &&
        (e.key === 'Tab' ||
          e.key === 'Backspace' ||
          e.key === ' ' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
      ) {
        e.preventDefault();
      }

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

      const newItem: KeyHistoryItem = {
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        keyCode: e.keyCode,
        timestamp: timeStr,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      };

      setCurrentEvent(newItem);
      setHistory((prev) => [newItem, ...prev.slice(0, 19)]); // 最大20件保存

      // 仮想キーボードのキーをアクティブにする
      setActiveCodes((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const clearHistory = () => {
    setHistory([]);
    setCurrentEvent(null);
    setActiveCodes(new Set());
  };

  return (
    <ToolPageLayout
      title="Keyboard Event Visualizer"
      description="キーボードを押すと、JavaScriptのイベント情報や入力パラメータをリアルタイムで美しく可視化します。"
      icon={Keyboard}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左側: メインイベント表示 (7列) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* メインイベント情報カード */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between relative">
              <span className="absolute top-4 left-4 text-xs font-bold text-text/40 tracking-wider uppercase flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" />
                現在のキーイベント
              </span>

              {currentEvent ? (
                <div className="pt-6">
                  {/* 大きなキー表示 */}
                  <div className="flex flex-col items-center justify-center my-6">
                    <div className="inline-flex items-center justify-center min-w-[100px] h-20 px-6 bg-accent text-white rounded-2xl text-4xl font-black shadow-lg shadow-accent/25 tracking-tight border border-accent/30 animate-scale-up">
                      {currentEvent.key === 'Space' ? 'Space' : currentEvent.key}
                    </div>
                    <span className="text-xs text-text/50 font-bold mt-2 font-mono">event.key</span>
                  </div>

                  {/* パラメータグリッド */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="bg-secondary/40 border border-border/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-text/50 font-bold uppercase tracking-wider">
                        code
                      </span>
                      <span className="text-sm font-mono font-bold mt-1 text-text truncate max-w-full">
                        {currentEvent.code}
                      </span>
                    </div>

                    <div className="bg-secondary/40 border border-border/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-text/50 font-bold uppercase tracking-wider">
                        keyCode
                      </span>
                      <span className="text-sm font-mono font-bold mt-1 text-accent">
                        {currentEvent.keyCode}
                      </span>
                    </div>

                    <div className="bg-secondary/40 border border-border/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-text/50 font-bold uppercase tracking-wider">
                        which
                      </span>
                      <span className="text-sm font-mono font-bold mt-1 text-text">
                        {currentEvent.keyCode}
                      </span>
                    </div>

                    <div className="bg-secondary/40 border border-border/80 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] text-text/50 font-bold uppercase tracking-wider">
                        time
                      </span>
                      <span className="text-xs font-mono font-semibold mt-1 text-text/75">
                        {currentEvent.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* 修飾キーインジケータ */}
                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    {[
                      { label: 'Ctrl', active: currentEvent.ctrlKey },
                      { label: 'Shift', active: currentEvent.shiftKey },
                      { label: 'Alt / Opt', active: currentEvent.altKey },
                      { label: 'Cmd / Win', active: currentEvent.metaKey },
                    ].map((key, i) => (
                      <span
                        key={i}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          key.active
                            ? 'bg-accent/10 border-accent/40 text-accent font-bold shadow-sm'
                            : 'bg-secondary/20 border-border text-text/40'
                        }`}
                      >
                        {key.label}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center my-auto py-10">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-3xl mb-4 animate-bounce">
                    ⌨️
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-text">キーボードを押してください</h3>
                  <p className="text-xs text-text/60 max-w-xs">
                    画面のアクティブ状態でキーボードを入力すると、イベント情報のキャプチャが開始されます。
                  </p>
                </div>
              )}
            </div>

            {/* 仮想キーボード */}
            <div className="bg-card border border-border rounded-3xl p-5 shadow-sm hidden md:flex flex-col gap-2 overflow-x-auto">
              <div className="flex justify-between items-center mb-2 px-1 gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-text/50 uppercase tracking-wider">
                    仮想キーボード
                  </span>
                  <div className="flex bg-secondary rounded-lg p-0.5 border border-border/80 text-[10px]">
                    <button
                      onClick={() => handleLayoutChange('us')}
                      className={`px-2 py-0.5 rounded-md transition-all font-bold cursor-pointer ${
                        layout === 'us'
                          ? 'bg-card text-accent shadow-sm'
                          : 'text-text/50 hover:text-text'
                      }`}
                    >
                      US配列
                    </button>
                    <button
                      onClick={() => handleLayoutChange('jis')}
                      className={`px-2 py-0.5 rounded-md transition-all font-bold cursor-pointer ${
                        layout === 'jis'
                          ? 'bg-card text-accent shadow-sm'
                          : 'text-text/50 hover:text-text'
                      }`}
                    >
                      JIS配列
                    </button>
                  </div>
                </div>
                <span className="text-[10px] bg-secondary text-text/60 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                  リアルタイム反応
                </span>
              </div>
              <div className="min-w-[700px] flex flex-col gap-1.5 p-2 bg-secondary/20 border border-border/60 rounded-2xl">
                {(layout === 'us' ? usKeyboardRows : jisKeyboardRows).map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1.5 w-full">
                    {row.map((key) => {
                      const isActive = activeCodes.has(key.code);
                      return (
                        <div
                          key={key.code}
                          className={`
                            h-10 text-[10px] font-bold rounded-lg border flex items-center justify-center transition-all shadow-sm select-none truncate
                            ${key.width || 'w-10'}
                            ${
                              isActive
                                ? 'bg-accent border-accent text-white scale-95 shadow-inner'
                                : 'bg-card border-border/80 text-text/80'
                            }
                          `}
                        >
                          {key.label}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側: 履歴リスト (5列) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-border/60 mb-4">
                  <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                    📋 入力履歴 (直近20件)
                  </h2>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-text/60 transition-colors cursor-pointer"
                      title="履歴をクリア"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                    {history.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentEvent(item)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all hover:bg-secondary/40 cursor-pointer ${
                          currentEvent?.timestamp === item.timestamp
                            ? 'bg-accent/5 border-accent/30 text-accent font-semibold'
                            : 'bg-secondary/20 border-border/60 text-text'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-text/40">{item.timestamp}</span>
                          <span className="font-mono text-sm font-bold bg-card px-2 py-0.5 rounded border border-border">
                            {item.key}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-xs text-text/60">
                          <span>code: {item.code}</span>
                          <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-bold">
                            {item.keyCode}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-text/40">
                    <ShieldAlert className="w-8 h-8 mb-2" />
                    <p className="text-xs">入力履歴がありません。</p>
                  </div>
                )}
              </div>

              {history.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/60 text-[10px] text-text/50 font-medium">
                  履歴をクリックすると、その時点のイベント詳細を再確認できます。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
