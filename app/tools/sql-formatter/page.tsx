'use client';

import { Database, Copy, Sparkles, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

// Basic custom SQL tokenizer and formatter
function formatSql(
  sql: string,
  options: { uppercase: boolean; indentType: 'space2' | 'space4' | 'tab' }
): string {
  if (!sql.trim()) return '';

  const indentStr =
    options.indentType === 'space2' ? '  ' : options.indentType === 'space4' ? '    ' : '\t';

  // Standardize multiple spaces/newlines to single spaces
  let cleanSql = sql
    .replace(/\s+/g, ' ')
    // Ensure spacing around parentheses and commas for easier token splitting
    .replace(/\(/g, ' ( ')
    .replace(/\)/g, ' ) ')
    .replace(/,/g, ' , ')
    .trim();

  // List of keywords we want to handle
  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'GROUP BY',
    'ORDER BY',
    'HAVING',
    'LIMIT',
    'JOIN',
    'LEFT JOIN',
    'RIGHT JOIN',
    'INNER JOIN',
    'OUTER JOIN',
    'CROSS JOIN',
    'ON',
    'AND',
    'OR',
    'INSERT INTO',
    'VALUES',
    'UPDATE',
    'SET',
    'DELETE',
    'UNION',
    'ALL',
    'CREATE TABLE',
    'WITH',
    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',
    'IN',
    'AS',
    'IS',
    'NULL',
    'NOT',
    'LIKE',
    'BETWEEN',
  ];

  // Capitalize or lowercase keywords
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  cleanSql = cleanSql.replace(keywordRegex, (match) => {
    return options.uppercase ? match.toUpperCase() : match.toLowerCase();
  });

  // Tokenize by spaces
  const tokens = cleanSql.split(/\s+/);

  let result = '';
  let indentLevel = 0;

  const getIndent = (level: number) => indentStr.repeat(Math.max(0, level));

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    const upperToken = token.toUpperCase();

    if (upperToken === '(') {
      result += ' (\n' + getIndent(++indentLevel);
    } else if (upperToken === ')') {
      indentLevel = Math.max(0, indentLevel - 1);
      result = result.trimEnd();
      result += '\n' + getIndent(indentLevel) + ')';
    } else if (upperToken === ',') {
      result = result.trimEnd();
      result += ',\n' + getIndent(indentLevel);
    } else if (keywords.includes(upperToken)) {
      // Direct newlines for primary clauses
      const isPrimaryClause = [
        'SELECT',
        'FROM',
        'WHERE',
        'GROUP BY',
        'ORDER BY',
        'LIMIT',
        'HAVING',
        'JOIN',
        'LEFT JOIN',
        'RIGHT JOIN',
        'INNER JOIN',
        'OUTER JOIN',
        'CROSS JOIN',
        'INSERT INTO',
        'VALUES',
        'UPDATE',
        'SET',
        'DELETE',
        'UNION',
      ].includes(upperToken);

      const isSubClause = ['AND', 'OR', 'ON'].includes(upperToken);

      if (isPrimaryClause) {
        result = result.trimEnd();
        result += '\n' + getIndent(indentLevel) + token;
      } else if (isSubClause) {
        result = result.trimEnd();
        result += '\n' + getIndent(indentLevel + 1) + token;
      } else {
        // Standard keywords (AS, IN, etc.) just get spaced
        if (!result.endsWith(' ') && !result.endsWith('\n') && !result.endsWith('(')) {
          result += ' ';
        }
        result += token;
      }
    } else {
      // Normal values / identifiers
      if (!result.endsWith(' ') && !result.endsWith('\n') && !result.endsWith('(')) {
        result += ' ';
      }
      result += token;
    }
  }

  // Final cleanup: fix extra spacing near punctuation
  return result
    .replace(/\s+\(\s+/g, ' (')
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}

export default function SqlFormatter() {
  const [rawSql, setRawSql] = useState('');
  const [uppercase, setUppercase] = useState(true);
  const [indentType, setIndentType] = useState<'space2' | 'space4' | 'tab'>('space2');
  const [copied, setCopied] = useState(false);

  const formattedSql = useMemo(() => {
    return formatSql(rawSql, { uppercase, indentType });
  }, [rawSql, uppercase, indentType]);

  const handleCopy = () => {
    if (!formattedSql) return;
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRawSql('');
  };

  const loadSample = () => {
    setRawSql(
      `select id,name,email,created_at from users left join orders on users.id=orders.user_id where users.active=1 and orders.total_price>1000 group by users.id order by users.created_at desc limit 10;`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-150 dark:border-slate-800 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                SQL Formatter
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                ごちゃごちゃしたSQLクエリを、見やすくインデント付きのクエリに整形（フォーマット）します。
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Options bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex flex-wrap gap-4">
                {/* Indentation Option */}
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2.5">
                    インデント
                  </span>
                  <select
                    value={indentType}
                    onChange={(e) => setIndentType(e.target.value as 'space2' | 'space4' | 'tab')}
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-850 dark:text-white"
                  >
                    <option value="space2">2スペース</option>
                    <option value="space4">4スペース</option>
                    <option value="tab">タブ</option>
                  </select>
                </div>

                {/* Uppercase Option */}
                <div className="flex items-center">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-550 dark:text-slate-350">
                    <input
                      type="checkbox"
                      checked={uppercase}
                      onChange={(e) => setUppercase(e.target.checked)}
                      className="accent-purple-600 rounded"
                    />
                    キーワードを大文字化
                  </label>
                </div>
              </div>

              {/* Sample / Clear */}
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-850 hover:bg-slate-100 border border-slate-250 dark:border-slate-800 text-slate-750 dark:text-slate-300 font-bold rounded-lg transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-650 dark:text-purple-400" />
                  サンプル読込
                </button>

                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-300 font-bold rounded-lg transition"
                >
                  クリア
                </button>
              </div>
            </div>

            {/* Input / Output Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  SQLクエリを入力
                </label>
                <textarea
                  value={rawSql}
                  onChange={(e) => setRawSql(e.target.value)}
                  placeholder="SELECT * FROM users WHERE active = 1 AND age > 20..."
                  className="w-full h-80 p-4 border border-slate-250 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-purple-500 focus:outline-none font-mono text-sm resize-y shadow-inner transition"
                />
              </div>

              {/* Output textarea */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    整形後のSQL
                  </label>

                  {formattedSql && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-xs bg-purple-650 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded transition"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'コピーしました！' : 'コピー'}
                    </button>
                  )}
                </div>

                <textarea
                  value={formattedSql}
                  readOnly
                  placeholder="ここに整形されたクエリが出力されます。"
                  className="w-full h-80 p-4 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 dark:text-white rounded-2xl font-mono text-sm resize-y shadow-inner transition select-all"
                />
              </div>
            </div>

            {/* Explanation box */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl">
              <h3 className="font-bold text-slate-850 dark:text-white mb-2">クエリ整形の効果</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                特にサブクエリや複数テーブルの `JOIN`
                が含まれる複雑なSQL文は、1行で書かれていると意図しない結合条件やフィルタの見落としに繋がります。
                キーワードの改行とインデントを適用することで、SQL文の構造（射影、結合、抽出条件）を瞬時に把握でき、デバッグ効率が大幅に向上します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
