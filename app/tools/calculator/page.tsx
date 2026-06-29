'use client';

import { useState, useEffect, useRef } from 'react';
import { Calculator, Copy, Check, Trash2, History, Delete } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

interface HistoryItem {
  id: string;
  formula: string;
  result: string;
  timestamp: string; // ISO string for JSON serialization
}

export default function CalculatorTool() {
  const [formula, setFormula] = useState<string>('');
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // ローカルストレージから履歴を読み込む
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setHistory(parsed);
        }, 0);
      } catch (e) {
        console.error('Failed to parse calculator history', e);
      }
    }
  }, []);

  // 履歴を保存する
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('calc_history', JSON.stringify(newHistory));
  };

  // 安全な計算式評価
  const evaluateFormula = (expr: string): string => {
    // 画面表示用の乗除記号を標準演算子に変換
    let targetExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // 末尾の不要な演算子を取り除く
    while (['+', '-', '*', '/'].includes(targetExpr.slice(-1))) {
      targetExpr = targetExpr.slice(0, -1);
    }

    if (!targetExpr) return '0';

    // セキュリティチェック: 許可された文字のみで構成されているか検証
    if (!/^[0-9+\-*/.() ]+$/.test(targetExpr)) {
      return 'Error';
    }

    try {
      // 安全に数式を評価
      const fn = new Function(`return (${targetExpr})`);
      const result = fn();

      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return 'Error';
      }

      // 浮動小数点精度の丸め (例: 0.1 + 0.2 = 0.3)
      const rounded = Math.round(result * 1e12) / 1e12;
      return rounded.toString();
    } catch {
      return 'Error';
    }
  };

  // 数字・小数点の入力
  const handleNumber = (num: string) => {
    if (isCalculated) {
      setDisplayValue(num === '.' ? '0.' : num);
      setFormula(num === '.' ? '0.' : num);
      setIsCalculated(false);
      return;
    }

    if (num === '.') {
      // 現在の入力値（最後の数字ブロック）に小数点が含まれているかチェック
      const parts = formula.split(/[\+\-×÷]/);
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes('.')) return;

      if (displayValue === '0' || displayValue === '') {
        setDisplayValue('0.');
        setFormula(formula === '' ? '0.' : formula + '.');
      } else {
        setDisplayValue(displayValue + '.');
        setFormula(formula + '.');
      }
    } else {
      if (displayValue === '0' && num === '0') return;

      const isLastCharOperator = ['+', '-', '×', '÷'].includes(formula.slice(-1));

      if (displayValue === '0' || isLastCharOperator) {
        setDisplayValue(num);
      } else {
        setDisplayValue(displayValue + num);
      }

      setFormula(formula === '0' ? num : formula + num);
    }
  };

  // 演算子の入力
  const handleOperator = (op: string) => {
    setIsCalculated(false);
    if (formula === '') {
      if (displayValue !== '0' && displayValue !== 'Error') {
        setFormula(displayValue + op);
      } else {
        setFormula('0' + op);
      }
      return;
    }

    const lastChar = formula.slice(-1);
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      // 演算子の置き換え
      setFormula(formula.slice(0, -1) + op);
    } else {
      setFormula(formula + op);
    }
    setDisplayValue(op);
  };

  // イコール（計算実行）
  const handleEquals = () => {
    if (formula === '' || isCalculated) return;

    const result = evaluateFormula(formula);

    if (result !== 'Error' && formula !== result) {
      // 履歴に追加
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        formula: formula,
        result: result,
        timestamp: new Date().toISOString(),
      };
      saveHistory([newItem, ...history].slice(0, 50)); // 最大50件
    }

    setDisplayValue(result);
    setFormula(result === 'Error' ? '' : result);
    setIsCalculated(true);
  };

  // クリア（AC / C）
  const handleClear = () => {
    setFormula('');
    setDisplayValue('0');
    setIsCalculated(false);
  };

  // 1文字削除（Backspace）
  const handleBackspace = () => {
    if (isCalculated) {
      handleClear();
      return;
    }

    if (formula.length > 0) {
      const nextFormula = formula.slice(0, -1);
      setFormula(nextFormula);

      // ディスプレイ表示の更新
      const lastChar = nextFormula.slice(-1);
      if (nextFormula === '') {
        setDisplayValue('0');
      } else if (['+', '-', '×', '÷'].includes(lastChar)) {
        setDisplayValue(lastChar);
      } else {
        // 最後の数値部分を切り出してディスプレイに表示
        const parts = nextFormula.split(/[\+\-×÷]/);
        const lastPart = parts[parts.length - 1];
        setDisplayValue(lastPart || '0');
      }
    }
  };

  // 符号反転（+/-）
  const handleToggleSign = () => {
    if (displayValue === '0' || displayValue === 'Error') return;

    if (isCalculated) {
      const toggled = (Number(displayValue) * -1).toString();
      setDisplayValue(toggled);
      setFormula(toggled);
      setIsCalculated(false);
      return;
    }

    // 数式の最後の数値を反転
    const parts = formula.split(/([\+\-×÷])/);
    if (parts.length === 0) return;

    const lastIndex = parts.length - 1;
    const lastNum = parts[lastIndex];

    if (lastNum && !isNaN(Number(lastNum))) {
      const toggledNum = (Number(lastNum) * -1).toString();
      parts[lastIndex] = toggledNum;
      setFormula(parts.join(''));
      setDisplayValue(toggledNum);
    }
  };

  // パーセント（%）
  const handlePercent = () => {
    if (displayValue === '0' || displayValue === 'Error') return;

    if (isCalculated) {
      const pct = (Number(displayValue) / 100).toString();
      setDisplayValue(pct);
      setFormula(pct);
      setIsCalculated(false);
      return;
    }

    const parts = formula.split(/([\+\-×÷])/);
    const lastIndex = parts.length - 1;
    const lastNum = parts[lastIndex];

    if (lastNum && !isNaN(Number(lastNum))) {
      const pctNum = (Number(lastNum) / 100).toString();
      parts[lastIndex] = pctNum;
      setFormula(parts.join(''));
      setDisplayValue(pctNum);
    }
  };

  // 結果のコピー
  const copyToClipboard = () => {
    if (displayValue === 'Error') return;
    navigator.clipboard.writeText(displayValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 履歴アイテムの使用
  const applyHistoryItem = (item: HistoryItem, type: 'formula' | 'result') => {
    if (type === 'formula') {
      setFormula(item.formula);
      // 最後の文字が演算子ならそれを、数値なら数値をディスプレイに
      const lastChar = item.formula.slice(-1);
      if (['+', '-', '×', '÷'].includes(lastChar)) {
        setDisplayValue(lastChar);
      } else {
        const parts = item.formula.split(/[\+\-×÷]/);
        setDisplayValue(parts[parts.length - 1] || '0');
      }
    } else {
      setFormula(item.result);
      setDisplayValue(item.result);
    }
    setIsCalculated(false);
  };

  // 履歴クリア
  const clearHistory = () => {
    saveHistory([]);
  };

  // 最新の状態とハンドラ関数を保持する ref
  const handlersRef = useRef({
    handleNumber,
    handleOperator,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercent,
    copyToClipboard,
  });

  // レンダリング毎に ref を最新化して常に最新のクロージャを保持
  useEffect(() => {
    handlersRef.current = {
      handleNumber,
      handleOperator,
      handleEquals,
      handleBackspace,
      handleClear,
      handlePercent,
      copyToClipboard,
    };
  });

  // キーボードイベントのハンドリング
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フォーム等にフォーカスがある場合は無視
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key;

      if (/[0-9]/.test(key)) {
        e.preventDefault();
        handlersRef.current.handleNumber(key);
      } else if (key === '.') {
        e.preventDefault();
        handlersRef.current.handleNumber('.');
      } else if (key === '+') {
        e.preventDefault();
        handlersRef.current.handleOperator('+');
      } else if (key === '-') {
        e.preventDefault();
        handlersRef.current.handleOperator('-');
      } else if (key === '*') {
        e.preventDefault();
        handlersRef.current.handleOperator('×');
      } else if (key === '/') {
        e.preventDefault();
        handlersRef.current.handleOperator('÷');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handlersRef.current.handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handlersRef.current.handleBackspace();
      } else if (key === 'Escape') {
        e.preventDefault();
        handlersRef.current.handleClear();
      } else if (key === '%') {
        e.preventDefault();
        handlersRef.current.handlePercent();
      } else if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handlersRef.current.copyToClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ToolPageLayout
      title="Calculator"
      description="ブラウザ完結型の多機能電卓です。直感的なマウス操作だけでなく、キーボード入力（テンキー・Enter等）にも完全対応。過去の計算履歴の呼び出しや、ワンクリックでの計算結果コピー機能も備えています。"
      icon={Calculator}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側：電卓本体 */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="theme-card p-6 bg-card max-w-md mx-auto w-full border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)]">
            {/* ディスプレイ */}
            <div className="bg-secondary/40 border-2 border-border rounded-xl p-4 mb-6 relative group transition-all">
              {/* 数式プレビュー (上部) */}
              <div className="text-right text-xs text-text/50 font-mono min-h-[1.25rem] truncate pr-8">
                {formula || ' '}
              </div>

              {/* 現在の入力・結果 (メイン) */}
              <div className="text-right text-3xl font-black font-mono tracking-tight text-text truncate pr-8 mt-1 select-all">
                {displayValue}
              </div>

              {/* 右側アクションボタン（コピー） */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={copyToClipboard}
                  disabled={displayValue === 'Error'}
                  className="p-1.5 rounded-lg border border-border bg-card text-text hover:text-accent hover:border-accent disabled:opacity-40 transition-colors cursor-pointer"
                  title="計算結果をコピー"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* キーパッドグリッド (5行4列) */}
            <div className="grid grid-cols-4 gap-3">
              {/* 1行目 */}
              <button
                onClick={handleClear}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-secondary text-text font-black text-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                title="オールクリア (Esc)"
              >
                AC
              </button>
              <button
                onClick={handleBackspace}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-secondary text-text font-black text-sm flex items-center justify-center hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                title="一文字削除 (Backspace)"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleSign}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-secondary text-text font-black text-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                +/-
              </button>
              <button
                onClick={() => handleOperator('÷')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                ÷
              </button>

              {/* 2行目 */}
              <button
                onClick={() => handleNumber('7')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                7
              </button>
              <button
                onClick={() => handleNumber('8')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                8
              </button>
              <button
                onClick={() => handleNumber('9')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                9
              </button>
              <button
                onClick={() => handleOperator('×')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                ×
              </button>

              {/* 3行目 */}
              <button
                onClick={() => handleNumber('4')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                4
              </button>
              <button
                onClick={() => handleNumber('5')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                5
              </button>
              <button
                onClick={() => handleNumber('6')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                6
              </button>
              <button
                onClick={() => handleOperator('-')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                -
              </button>

              {/* 4行目 */}
              <button
                onClick={() => handleNumber('1')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                1
              </button>
              <button
                onClick={() => handleNumber('2')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                2
              </button>
              <button
                onClick={() => handleNumber('3')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                3
              </button>
              <button
                onClick={() => handleOperator('+')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                +
              </button>

              {/* 5行目 */}
              <button
                onClick={() => handleNumber('0')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => handleNumber('.')}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                .
              </button>
              <button
                onClick={handlePercent}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
              >
                %
              </button>
              <button
                onClick={handleEquals}
                className="col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer"
                title="計算結果を実行 (Enter / =)"
              >
                =
              </button>
            </div>

            {/* キーボードショートカットヘルプ */}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-text/40 font-semibold">
                ⌨️ キーボード入力対応: [0-9] [+] [-] [*] [/] [Enter] [Backspace] [Esc] [C (コピー)]
              </span>
            </div>
          </div>
        </div>

        {/* 右側：計算履歴 */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] h-full min-h-[300px] flex flex-col">
            {/* 履歴ヘッダー */}
            <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-text">
                <History className="w-4 h-4 text-accent" />
                <span>計算履歴</span>
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1 rounded-lg hover:bg-secondary text-text/40 hover:text-red-500 transition-colors cursor-pointer"
                  title="履歴をクリア"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 履歴リスト */}
            <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center py-12 text-center text-xs text-text/40 font-bold">
                  履歴はありません。
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-secondary/30 hover:bg-secondary/60 border border-border rounded-xl transition-all group/item"
                  >
                    <div className="text-[10px] text-text/50 font-mono text-right truncate">
                      {item.formula} =
                    </div>
                    <div className="text-right font-black font-mono text-text text-sm mt-1 truncate">
                      {item.result}
                    </div>
                    <div className="mt-2 flex justify-between items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <span className="text-[9px] text-text/30">
                        {new Date(item.timestamp).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => applyHistoryItem(item, 'formula')}
                          className="px-2 py-0.5 text-[9px] font-bold rounded border border-border bg-card hover:border-accent hover:text-accent transition-colors cursor-pointer"
                          title="式をロード"
                        >
                          式を適用
                        </button>
                        <button
                          onClick={() => applyHistoryItem(item, 'result')}
                          className="px-2 py-0.5 text-[9px] font-bold rounded border border-border bg-card hover:border-accent hover:text-accent transition-colors cursor-pointer"
                          title="結果をロード"
                        >
                          結果を適用
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
