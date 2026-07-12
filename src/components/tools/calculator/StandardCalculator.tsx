'use client';

import { useCallback, useMemo, useReducer, useState, useEffect } from 'react';
import { Calculator, Copy, Check, Trash2, History, Delete } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface HistoryItem {
  id: string;
  formula: string;
  result: string;
  timestamp: string; // ISO string for JSON serialization
}

// ---------------------------------------------------------------------------
// Calculator State & Reducer
// ---------------------------------------------------------------------------

type CalcState = {
  formula: string;
  displayValue: string;
  isCalculated: boolean;
};

type CalcAction =
  | { type: 'NUMBER'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'EQUALS'; result: string }
  | { type: 'EQUALS_TRIGGER' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'PERCENT' }
  | { type: 'APPLY_HISTORY'; applyType: 'formula' | 'result'; formula: string; result: string };

const OPERATORS = ['+', '-', '×', '÷'];
const initialCalcState: CalcState = { formula: '', displayValue: '0', isCalculated: false };

// ---------------------------------------------------------------------------
// Safe Formula Evaluator (reducer より前に定義して EQUALS_TRIGGER で利用)
// ---------------------------------------------------------------------------

function evaluateFormula(expr: string): string {
  let targetExpr = expr.replace(/×/g, '*').replace(/÷/g, '/');
  while (['+', '-', '*', '/'].includes(targetExpr.slice(-1))) {
    targetExpr = targetExpr.slice(0, -1);
  }
  if (!targetExpr) return '0';
  if (!/^[0-9+\-*/.() ]+$/.test(targetExpr)) return 'Error';

  const parseAndEvaluate = (valExpr: string): number => {
    let index = 0;
    const peek = () => valExpr[index];
    const consume = () => valExpr[index++];
    const skipWhitespace = () => {
      while (peek() === ' ') consume();
    };

    const parseNumber = (): number => {
      skipWhitespace();
      const start = index;
      if (peek() === '-' || peek() === '+') consume();
      while (peek() !== undefined && /[0-9.]/.test(peek())) consume();
      const val = parseFloat(valExpr.slice(start, index));
      if (isNaN(val)) throw new Error('Invalid number');
      return val;
    };

    const parseFactor = (): number => {
      skipWhitespace();
      if (peek() === '(') {
        consume();
        const val = parseExpression();
        skipWhitespace();
        if (peek() !== ')') throw new Error('Mismatched parenthesis');
        consume();
        return val;
      }
      return parseNumber();
    };

    const parseTerm = (): number => {
      let val = parseFactor();
      skipWhitespace();
      while (peek() === '*' || peek() === '/') {
        const op = consume();
        const nextVal = parseFactor();
        val =
          op === '*'
            ? val * nextVal
            : nextVal === 0
              ? (() => {
                  throw new Error('Division by zero');
                })()
              : val / nextVal;
        skipWhitespace();
      }
      return val;
    };

    const parseExpression = (): number => {
      let val = parseTerm();
      skipWhitespace();
      while (peek() === '+' || peek() === '-') {
        const op = consume();
        val = op === '+' ? val + parseTerm() : val - parseTerm();
        skipWhitespace();
      }
      return val;
    };

    const result = parseExpression();
    skipWhitespace();
    if (index < valExpr.length) throw new Error('Extra tokens');
    return result;
  };

  try {
    const result = parseAndEvaluate(targetExpr);
    if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) return 'Error';
    return (Math.round(result * 1e12) / 1e12).toString();
  } catch {
    return 'Error';
  }
}

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  const { formula, displayValue, isCalculated } = state;

  switch (action.type) {
    case 'NUMBER': {
      const num = action.payload;
      // 計算直後は新しい入力として扱う
      if (isCalculated) {
        const val = num === '.' ? '0.' : num;
        return { formula: val, displayValue: val, isCalculated: false };
      }
      if (num === '.') {
        // 現在の入力値の最後の数字ブロックに既に小数点があればスキップ
        const parts = formula.split(/[\+\-×÷]/);
        if (parts[parts.length - 1].includes('.')) return state;
        if (displayValue === '0' || displayValue === '') {
          return { ...state, displayValue: '0.', formula: formula === '' ? '0.' : formula + '.' };
        }
        return { ...state, displayValue: displayValue + '.', formula: formula + '.' };
      }
      if (displayValue === '0' && num === '0') return state;
      const isLastOp = OPERATORS.includes(formula.slice(-1));
      return {
        ...state,
        displayValue: displayValue === '0' || isLastOp ? num : displayValue + num,
        formula: formula === '0' ? num : formula + num,
      };
    }

    case 'OPERATOR': {
      const op = action.payload;
      let newFormula: string;
      if (formula === '') {
        // まだ数式がない場合は displayValue を先頭に使う
        newFormula = (displayValue !== '0' && displayValue !== 'Error' ? displayValue : '0') + op;
        return { formula: newFormula, displayValue: displayValue, isCalculated: false };
      }
      if (OPERATORS.includes(formula.slice(-1))) {
        // 末尾の演算子を置き換える
        newFormula = formula.slice(0, -1) + op;
      } else {
        newFormula = formula + op;
      }
      return { formula: newFormula, displayValue: op, isCalculated: false };
    }

    case 'EQUALS': {
      return {
        formula: action.result === 'Error' ? '' : action.result,
        displayValue: action.result,
        isCalculated: true,
      };
    }

    case 'CLEAR': {
      return { formula: '', displayValue: '0', isCalculated: false };
    }

    case 'BACKSPACE': {
      if (isCalculated) return { formula: '', displayValue: '0', isCalculated: false };
      if (formula.length === 0) return state;
      const nextFormula = formula.slice(0, -1);
      const lastChar = nextFormula.slice(-1);
      let nextDisplay: string;
      if (nextFormula === '') {
        nextDisplay = '0';
      } else if (OPERATORS.includes(lastChar)) {
        nextDisplay = lastChar;
      } else {
        const parts = nextFormula.split(/[\+\-×÷]/);
        nextDisplay = parts[parts.length - 1] || '0';
      }
      return { ...state, formula: nextFormula, displayValue: nextDisplay };
    }

    case 'TOGGLE_SIGN': {
      if (displayValue === '0' || displayValue === 'Error') return state;
      if (isCalculated) {
        const toggled = (Number(displayValue) * -1).toString();
        return { formula: toggled, displayValue: toggled, isCalculated: false };
      }
      const tParts = formula.split(/([\+\-×÷])/);
      const tLast = tParts[tParts.length - 1];
      if (!tLast || isNaN(Number(tLast))) return state;
      const toggledNum = (Number(tLast) * -1).toString();
      tParts[tParts.length - 1] = toggledNum;
      return { ...state, formula: tParts.join(''), displayValue: toggledNum };
    }

    case 'PERCENT': {
      if (displayValue === '0' || displayValue === 'Error') return state;
      if (isCalculated) {
        const pct = (Number(displayValue) / 100).toString();
        return { formula: pct, displayValue: pct, isCalculated: false };
      }
      const pParts = formula.split(/([\+\-×÷])/);
      const pLast = pParts[pParts.length - 1];
      if (!pLast || isNaN(Number(pLast))) return state;
      const pctNum = (Number(pLast) / 100).toString();
      pParts[pParts.length - 1] = pctNum;
      return { ...state, formula: pParts.join(''), displayValue: pctNum };
    }

    case 'EQUALS_TRIGGER': {
      if (formula === '' || isCalculated) return state;
      const result = evaluateFormula(formula);
      return {
        formula: result === 'Error' ? '' : result,
        displayValue: result,
        isCalculated: true,
      };
    }

    case 'APPLY_HISTORY': {
      if (action.applyType === 'formula') {
        const lastChar = action.formula.slice(-1);
        const dv = OPERATORS.includes(lastChar)
          ? lastChar
          : action.formula.split(/[\+\-×÷]/).pop() || '0';
        return { formula: action.formula, displayValue: dv, isCalculated: false };
      }
      return { formula: action.result, displayValue: action.result, isCalculated: false };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Button Styles
// ---------------------------------------------------------------------------

const BTN_STYLES: Record<string, string> = {
  fn: 'col-span-1 p-4 rounded-xl border-2 border-border bg-secondary text-text font-black text-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center',
  num: 'col-span-1 p-4 rounded-xl border-2 border-border bg-card text-text font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer',
  op: 'col-span-1 p-4 rounded-xl border-2 border-border bg-accent text-white font-black text-lg hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--border)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StandardCalculator() {
  const [calcState, dispatch] = useReducer(calcReducer, initialCalcState);
  const { formula, displayValue } = calcState;
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { copied, copy } = useCopyToClipboard();

  // ローカルストレージから履歴を読み込む
  useEffect(() => {
    const saved = localStorage.getItem('calc_history');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse calculator history', e);
      }
    }
  }, []);

  // isCalculated が true になったタイミングで履歴を保存する（LocalStorage との同期副作用）

  useEffect(() => {
    if (!calcState.isCalculated) return;
    const f = calcState.formula;
    const dv = calcState.displayValue;
    if (dv === 'Error' || dv === '0' || f === dv) return;
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      formula: f,
      result: dv,
      timestamp: new Date().toISOString(),
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory((prev) => {
      const newHistory = [newItem, ...prev].slice(0, 50);
      localStorage.setItem('calc_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [calcState.isCalculated, calcState.formula, calcState.displayValue]);

  // handleEquals: dispatch のみに依存するため useRef 不要
  const handleEquals = useCallback(() => {
    dispatch({ type: 'EQUALS_TRIGGER' });
  }, []);

  const handleCopy = useCallback(() => {
    if (displayValue !== 'Error') copy(displayValue);
  }, [displayValue, copy]);

  // ---------------------------------------------------------------------------
  // Button definitions (data-driven)
  // ---------------------------------------------------------------------------

  // useMemo でメモ化してレンダリング毎の配列再生成を避ける
  const buttons = useMemo(
    () => [
      // 1行目
      {
        id: 'ac',
        label: 'AC',
        onPress: () => dispatch({ type: 'CLEAR' }),
        style: 'fn',
        title: 'オールクリア (Esc)',
      },
      {
        id: 'bs',
        label: <Delete className="w-4 h-4" />,
        onPress: () => dispatch({ type: 'BACKSPACE' }),
        style: 'fn',
        title: '一文字削除 (Backspace)',
      },
      { id: 'pm', label: '+/-', onPress: () => dispatch({ type: 'TOGGLE_SIGN' }), style: 'fn' },
      {
        id: 'div',
        label: '÷',
        onPress: () => dispatch({ type: 'OPERATOR', payload: '÷' }),
        style: 'op',
      },
      // 2行目
      {
        id: 'n7',
        label: '7',
        onPress: () => dispatch({ type: 'NUMBER', payload: '7' }),
        style: 'num',
      },
      {
        id: 'n8',
        label: '8',
        onPress: () => dispatch({ type: 'NUMBER', payload: '8' }),
        style: 'num',
      },
      {
        id: 'n9',
        label: '9',
        onPress: () => dispatch({ type: 'NUMBER', payload: '9' }),
        style: 'num',
      },
      {
        id: 'mul',
        label: '×',
        onPress: () => dispatch({ type: 'OPERATOR', payload: '×' }),
        style: 'op',
      },
      // 3行目
      {
        id: 'n4',
        label: '4',
        onPress: () => dispatch({ type: 'NUMBER', payload: '4' }),
        style: 'num',
      },
      {
        id: 'n5',
        label: '5',
        onPress: () => dispatch({ type: 'NUMBER', payload: '5' }),
        style: 'num',
      },
      {
        id: 'n6',
        label: '6',
        onPress: () => dispatch({ type: 'NUMBER', payload: '6' }),
        style: 'num',
      },
      {
        id: 'sub',
        label: '-',
        onPress: () => dispatch({ type: 'OPERATOR', payload: '-' }),
        style: 'op',
      },
      // 4行目
      {
        id: 'n1',
        label: '1',
        onPress: () => dispatch({ type: 'NUMBER', payload: '1' }),
        style: 'num',
      },
      {
        id: 'n2',
        label: '2',
        onPress: () => dispatch({ type: 'NUMBER', payload: '2' }),
        style: 'num',
      },
      {
        id: 'n3',
        label: '3',
        onPress: () => dispatch({ type: 'NUMBER', payload: '3' }),
        style: 'num',
      },
      {
        id: 'add',
        label: '+',
        onPress: () => dispatch({ type: 'OPERATOR', payload: '+' }),
        style: 'op',
      },
      // 5行目
      {
        id: 'n0',
        label: '0',
        onPress: () => dispatch({ type: 'NUMBER', payload: '0' }),
        style: 'num',
      },
      {
        id: 'dot',
        label: '.',
        onPress: () => dispatch({ type: 'NUMBER', payload: '.' }),
        style: 'num',
      },
      { id: 'pct', label: '%', onPress: () => dispatch({ type: 'PERCENT' }), style: 'num' },
      {
        id: 'eq',
        label: '=',
        onPress: handleEquals,
        style: 'op',
        title: '計算結果を実行 (Enter / =)',
      },
    ],
    [handleEquals]
  );

  // ---------------------------------------------------------------------------
  // Keyboard handler
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
        dispatch({ type: 'NUMBER', payload: key });
      } else if (key === '.') {
        e.preventDefault();
        dispatch({ type: 'NUMBER', payload: '.' });
      } else if (key === '+') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '+' });
      } else if (key === '-') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '-' });
      } else if (key === '*') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '×' });
      } else if (key === '/') {
        e.preventDefault();
        dispatch({ type: 'OPERATOR', payload: '÷' });
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'BACKSPACE' });
      } else if (key === 'Escape') {
        e.preventDefault();
        dispatch({ type: 'CLEAR' });
      } else if (key === '%') {
        e.preventDefault();
        dispatch({ type: 'PERCENT' });
      } else if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleEquals, handleCopy]); // stable useCallback なので実質リレンダーなし

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <>
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
                  onClick={handleCopy}
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

            {/* キーパッドグリッド (5行4列・データ駆動) */}
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={btn.onPress}
                  className={BTN_STYLES[btn.style]}
                  title={btn.title}
                >
                  {btn.label}
                </button>
              ))}
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
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('calc_history');
                  }}
                  className="p-1 rounded-lg hover:bg-secondary text-text/40 hover:text-red-500 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent"
                  title="履歴をクリア"
                  aria-label="履歴をクリア"
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
                          onClick={() =>
                            dispatch({
                              type: 'APPLY_HISTORY',
                              applyType: 'formula',
                              formula: item.formula,
                              result: item.result,
                            })
                          }
                          className="px-2 py-0.5 text-[9px] font-bold rounded border border-border bg-card hover:border-accent hover:text-accent transition-colors cursor-pointer"
                          title="式をロード"
                        >
                          式を適用
                        </button>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'APPLY_HISTORY',
                              applyType: 'result',
                              formula: item.formula,
                              result: item.result,
                            })
                          }
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
    </>
  );
}
