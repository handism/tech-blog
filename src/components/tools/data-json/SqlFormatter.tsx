// src/components/tools/data-json/SqlFormatter.tsx
'use client';

import { Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import CopyButton from '@/src/components/CopyButton';

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

  const formattedSql = useMemo(() => {
    return formatSql(rawSql, { uppercase, indentType });
  }, [rawSql, uppercase, indentType]);

  const handleClear = () => {
    setRawSql('');
  };

  const loadSample = () => {
    setRawSql(
      `select id,name,email,created_at from users left join orders on users.id=orders.user_id where users.active=1 and orders.total_price>1000 group by users.id order by users.created_at desc limit 10;`
    );
  };

  return (
    <div className="space-y-6">
      {/* オプションバー */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-secondary p-4 rounded-xl border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
        <div className="flex flex-wrap gap-4">
          {/* インデント設定 */}
          <div>
            <span className="text-xs font-bold text-text/60 mr-2.5">インデント</span>
            <select
              value={indentType}
              onChange={(e) => setIndentType(e.target.value as 'space2' | 'space4' | 'tab')}
              className="px-2.5 py-1.5 bg-card border-2 border-border rounded-lg text-xs font-bold text-text focus:outline-none"
            >
              <option value="space2">2スペース</option>
              <option value="space4">4スペース</option>
              <option value="tab">タブ</option>
            </select>
          </div>

          {/* 大文字化設定 */}
          <div className="flex items-center">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-text/80">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="accent-accent border-2 border-border rounded"
              />
              キーワードを大文字化
            </label>
          </div>
        </div>

        {/* サンプル / クリア */}
        <div className="flex gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-card hover:bg-secondary border-2 border-border font-bold rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            サンプル読込
          </button>

          <button
            onClick={handleClear}
            className="theme-btn px-3 py-1.5 text-xs font-bold bg-secondary border-2 border-border rounded-lg transition"
          >
            クリア
          </button>
        </div>
      </div>

      {/* 入出力パネル */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 入力欄 */}
        <div>
          <label className="block text-xs font-bold text-text/60 uppercase tracking-wider mb-2">
            SQLクエリを入力
          </label>
          <textarea
            value={rawSql}
            onChange={(e) => setRawSql(e.target.value)}
            placeholder="SELECT * FROM users WHERE active = 1 AND age > 20..."
            className="w-full h-80 p-4 border-2 border-border bg-card text-text rounded-2xl focus:ring-2 focus:ring-accent focus:outline-none font-mono text-sm resize-y shadow-[2px_2px_0px_0px_var(--border)] transition"
          />
        </div>

        {/* 出力欄 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-text/60 uppercase tracking-wider">
              整形後のSQL
            </label>

            {formattedSql && (
              <CopyButton
                value={formattedSql}
                label="コピー"
                copiedLabel="コピーしました！"
                iconClassName="w-3 h-3"
                copiedIconClassName="w-3 h-3"
                className="theme-btn bg-accent text-white border-accent shadow-[3px_3px_0px_0px_var(--border)] dark:shadow-[3px_3px_0px_0px_var(--accent)] font-bold px-3 py-1 text-xs cursor-pointer flex items-center gap-1"
              />
            )}
          </div>

          <textarea
            value={formattedSql}
            readOnly
            placeholder="ここに整形されたクエリが出力されます。"
            className="w-full h-80 p-4 border-2 border-border bg-secondary text-text rounded-2xl font-mono text-sm resize-y shadow-[2px_2px_0px_0px_var(--border)] select-all"
          />
        </div>
      </div>

      {/* 解説 */}
      <div className="bg-secondary border-2 border-border p-6 rounded-xl shadow-[4px_4px_0px_0px_var(--border)] text-sm">
        <h3 className="font-bold text-text mb-2">クエリ整形の効果</h3>
        <p className="text-text/75 leading-relaxed font-medium">
          特にサブクエリや複数テーブルの `JOIN`
          が含まれる複雑なSQL文は、1行で書かれていると意図しない結合条件やフィルタの見落としに繋がります。
          キーワードの改行とインデントを適用することで、SQL文の構造（射影、結合、抽出条件）を瞬時に把握でき、デバッグ効率が大幅に向上します。
        </p>
      </div>
    </div>
  );
}
