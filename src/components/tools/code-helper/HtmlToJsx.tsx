// src/components/tools/markup/HtmlToJsx.tsx
'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

export default function HtmlToJsx() {
  const [htmlInput, setHtmlInput] = useState('');
  const { copied, copy } = useCopyToClipboard();

  // 変換メインロジック (useMemoによる派生)
  const { jsxOutput, error } = useMemo(() => {
    if (!htmlInput.trim()) {
      return { jsxOutput: '', error: null };
    }

    try {
      let jsx = htmlInput;

      // 1. コメントの変換 <!-- ... --> -> {/* ... */}
      jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

      // 2. class -> className
      jsx = jsx.replace(/\bclass\s*=\s*"([^"]*)"/g, 'className="$1"');
      jsx = jsx.replace(/\bclass\s*=\s*'([^']*)'/g, "className='$1'");
      jsx = jsx.replace(/\bclass\s*=\s*([^{}\s>]+)/g, 'className={$1}');

      // 3. for -> htmlFor
      jsx = jsx.replace(/\bfor\s*=\s*"([^"]*)"/g, 'htmlFor="$1"');
      jsx = jsx.replace(/\bfor\s*=\s*'([^']*)'/g, "htmlFor='$1'");
      jsx = jsx.replace(/\bfor\s*=\s*([^{}\s>]+)/g, 'htmlFor={$1}');

      // 4. その他のよく使う属性のキャメルケース化
      const attributesMap: Record<string, string> = {
        tabindex: 'tabIndex',
        readonly: 'readOnly',
        maxlength: 'maxLength',
        minlength: 'minLength',
        autocomplete: 'autoComplete',
        autofocus: 'autoFocus',
        contenteditable: 'contentEditable',
        spellcheck: 'spellCheck',
        colspan: 'colSpan',
        rowspan: 'rowSpan',
        onclick: 'onClick',
        onsubmit: 'onSubmit',
        onchange: 'onChange',
        oninput: 'onInput',
        onkeydown: 'onKeyDown',
        onkeyup: 'onKeyUp',
      };

      Object.entries(attributesMap).forEach(([htmlAttr, jsxAttr]) => {
        const regex = new RegExp(`\\b${htmlAttr}\\s*=\\s*`, 'gi');
        jsx = jsx.replace(regex, `${jsxAttr}=`);
      });

      // 5. インラインスタイルの変換 style="..." -> style={{...}}
      const styleRegex = /style\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
      jsx = jsx.replace(styleRegex, (match, doubleQuoted, singleQuoted) => {
        const styleStr = doubleQuoted || singleQuoted || '';

        // CSS宣言を分割してオブジェクト表現へ変換
        const declarations = styleStr
          .split(';')
          .map((d: string) => d.trim())
          .filter(Boolean);
        const rules = declarations
          .map((decl: string) => {
            const colonIndex = decl.indexOf(':');
            if (colonIndex === -1) return null;

            const key = decl.substring(0, colonIndex).trim().toLowerCase();
            const value = decl.substring(colonIndex + 1).trim();

            // CSSキーをキャメルケースに変換
            let camelKey = key.replace(/-([a-z])/g, (_match: string, p1: string) =>
              p1.toUpperCase()
            );
            if (camelKey.startsWith('Webkit')) {
              camelKey = camelKey.charAt(0).toLowerCase() + camelKey.slice(1);
            }

            // 数値かつ単位なし、またはクォートがあるかチェック
            const isNumeric = /^\d+(\.\d+)?$/.test(value);
            const formattedValue = isNumeric ? value : `"${value.replace(/"/g, '\\"')}"`;

            return `${camelKey}: ${formattedValue}`;
          })
          .filter(Boolean);

        return `style={{ ${rules.join(', ')} }}`;
      });

      // 6. 自己完結タグの修正
      const selfClosingTags = [
        'img',
        'input',
        'br',
        'hr',
        'link',
        'meta',
        'area',
        'base',
        'col',
        'embed',
        'param',
        'source',
        'track',
        'wbr',
      ];

      selfClosingTags.forEach((tag) => {
        const regex = new RegExp(`<(${tag})\\b([^>]*?)(?<!\\/)>`, 'gi');
        jsx = jsx.replace(regex, `<$1$2 />`);
      });

      return { jsxOutput: jsx, error: null };
    } catch (err) {
      console.error(err);
      return {
        jsxOutput: '',
        error: 'HTMLコードの解析中にエラーが発生しました。構文が正しいか確認してください。',
      };
    }
  }, [htmlInput]);

  const handleCopy = () => {
    if (!jsxOutput) return;
    copy(jsxOutput);
  };

  const handleClear = () => {
    setHtmlInput('');
  };

  const loadSample = () => {
    const sampleHtml = `<div class="card" style="margin-top: 20px; background-color: #fff;">
  <header class="card-header">
    <h3 class="title">ユーザープロフィール</h3>
    <hr>
  </header>
  <form action="#" method="POST" onclick="alert('clicked')">
    <div class="form-group">
      <label for="username">ユーザー名</label>
      <input type="text" id="username" class="form-control" placeholder="ユーザー名を入力してください" tabindex="1">
    </div>
    <!-- 送信ボタン -->
    <button type="submit" class="btn btn-primary">登録する</button>
  </form>
</div>`;
    setHtmlInput(sampleHtml);
  };

  return (
    <div className="space-y-6 text-text">
      {/* コントロールバー */}
      <div className="flex flex-wrap gap-3 justify-between items-center bg-secondary/35 p-4 rounded-xl border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]">
        <div className="flex gap-2">
          <button
            onClick={loadSample}
            className="theme-btn px-4 py-2 text-xs font-bold hover:text-accent shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer"
          >
            サンプルを読み込む
          </button>
          <button
            onClick={handleClear}
            className="theme-btn px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 shadow-[1px_1px_0px_0px_var(--border)] cursor-pointer"
          >
            クリア
          </button>
        </div>

        {jsxOutput && (
          <button
            onClick={handleCopy}
            className="theme-btn bg-accent text-white border-accent px-5 py-2 text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>コピーする</span>
          </button>
        )}
      </div>

      {/* 入出力エリア */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HTML入力 */}
        <div className="theme-card p-4 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex flex-col h-[450px]">
          <label
            htmlFor="html-input"
            className="text-xs font-extrabold mb-2 text-text/60 uppercase tracking-wider"
          >
            HTML 入力 (貼り付け)
          </label>
          <textarea
            id="html-input"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder='ここにHTMLコードを貼り付けてください... (例: <div class="container" style="color: red;">)'
            className="w-full flex-1 p-3 font-mono text-xs border-2 border-border rounded-xl bg-secondary/30 text-text placeholder-text/40 resize-none focus:outline-none focus:ring-1 focus:ring-accent shadow-inner"
          />
        </div>

        {/* JSX出力 */}
        <div className="theme-card p-4 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex flex-col h-[450px] relative">
          <label
            htmlFor="jsx-output"
            className="text-xs font-extrabold mb-2 text-text/60 uppercase tracking-wider"
          >
            JSX 出力
          </label>
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border-2 border-red-500 font-bold shadow-inner">
              <AlertCircle className="w-8 h-8 mb-2 shrink-0" />
              <p className="text-xs">{error}</p>
            </div>
          ) : jsxOutput ? (
            <textarea
              id="jsx-output"
              readOnly
              value={jsxOutput}
              placeholder="変換されたJSXがここに表示されます..."
              className="w-full flex-1 p-3 font-mono text-xs border border-border rounded-xl bg-slate-950 text-slate-100 resize-none focus:outline-none shadow-inner select-all leading-relaxed"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text/40 bg-secondary/30 border-2 border-dashed border-border/20 rounded-xl text-center p-6 shadow-inner">
              <span className="text-3xl mb-2">⚡</span>
              <p className="text-xs font-bold">HTMLを入力すると自動でJSXに変換されます</p>
            </div>
          )}
        </div>
      </div>

      {/* 変換機能の説明/ヒント */}
      <div className="theme-card p-5 space-y-3 bg-secondary border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] text-sm">
        <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-text">
          💡 変換のルールと仕様
        </h4>
        <ul className="text-xs font-bold text-text/75 space-y-2 list-disc list-inside">
          <li>
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              class
            </code>{' '}
            属性は{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              className
            </code>{' '}
            に自動置換されます。
          </li>
          <li>
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              for
            </code>{' '}
            属性は{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              htmlFor
            </code>{' '}
            に置換されます。
          </li>
          <li>
            自己完結タグ（例:{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              &lt;img&gt;
            </code>{' '}
            や{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              &lt;input&gt;
            </code>
            ）は、 末尾にスラッシュを入れて閉じられます（例:{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              &lt;img /&gt;
            </code>
            ）。
          </li>
          <li>
            インラインの{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              style
            </code>{' '}
            属性は、 Reactのオブジェクト表現（例:{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              style={'{'} marginTop: &quot;10px&quot; {'}'}
            </code>
            ）にパースして書き換えられます。
          </li>
          <li>
            HTMLのコメント{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              &lt;!-- --&gt;
            </code>{' '}
            は React用のコメント{' '}
            <code className="bg-card px-1 py-0.5 rounded border border-border/50 text-accent">
              {'{/* */}'}
            </code>{' '}
            に変換されます。
          </li>
        </ul>
      </div>
    </div>
  );
}
