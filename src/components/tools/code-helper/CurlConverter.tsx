'use client';

import { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Send } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  user: string;
}

const DEFAULT_CURL = `curl 'https://api.github.com/repos/handism/handism.github.io/issues' \\
  -X POST \\
  -H 'Accept: application/vnd.github+json' \\
  -H 'Authorization: Bearer YOUR_GITHUB_TOKEN' \\
  -d '{"title": "Bug report", "body": "This is a test issue."}'`;

function parseCurl(curlCommand: string): ParsedCurl {
  const cleanCmd = curlCommand.replace(/\\\s*\n/g, ' ').trim();

  // 単純なクォート考慮トークナイザー
  const args: string[] = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < cleanCmd.length; i++) {
    const char = cleanCmd[i];
    if (char === '"' || char === "'") {
      if (inQuote && quoteChar === char) {
        inQuote = false;
        quoteChar = '';
      } else if (!inQuote) {
        inQuote = true;
        quoteChar = char;
      } else {
        current += char;
      }
    } else if (char === ' ' && !inQuote) {
      if (current) {
        args.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) args.push(current);

  let url = '';
  let method = '';
  const headers: Record<string, string> = {};
  let body = '';
  let user = '';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i].trim();
    if (arg === '-X' || arg === '--request') {
      method = args[i + 1] || '';
      i++;
    } else if (arg === '-H' || arg === '--header') {
      const headerStr = args[i + 1] || '';
      const colonIdx = headerStr.indexOf(':');
      if (colonIdx !== -1) {
        const key = headerStr.substring(0, colonIdx).trim();
        const val = headerStr.substring(colonIdx + 1).trim();
        headers[key] = val;
      }
      i++;
    } else if (
      arg === '-d' ||
      arg === '--data' ||
      arg === '--data-raw' ||
      arg === '--data-binary'
    ) {
      body = args[i + 1] || '';
      i++;
    } else if (arg === '-u' || arg === '--user') {
      user = args[i + 1] || '';
      i++;
    } else if (arg.startsWith('http://') || arg.startsWith('https://')) {
      url = arg;
    } else if (arg === 'curl') {
      // ignore
    } else {
      if (!url && (arg.includes('://') || arg.includes('.'))) {
        // 先頭・末尾のクォート除去
        url = arg.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  if (!method) {
    method = body ? 'POST' : 'GET';
  }

  // Basic認証ヘッダーへの展開
  if (user) {
    try {
      const encoded = btoa(unescape(encodeURIComponent(user)));
      headers['Authorization'] = `Basic ${encoded}`;
    } catch {
      headers['Authorization'] = `Basic [AuthTokenError]`;
    }
  }

  return {
    url: url || 'https://api.example.com/endpoint',
    method: method.toUpperCase(),
    headers,
    body,
    user,
  };
}

export default function CurlConverter() {
  const [curlInput, setCurlInput] = useState(DEFAULT_CURL);
  const [activeLang, setActiveLang] = useState<'fetch' | 'axios' | 'python' | 'go'>('fetch');
  const { copied, copy } = useCopyToClipboard();

  const parsed = useMemo(() => {
    return parseCurl(curlInput);
  }, [curlInput]);

  const generatedCode = useMemo(() => {
    const { url, method, headers, body } = parsed;

    // JSON検証
    let isJson = false;
    let jsonFormatted = '';
    if (body) {
      try {
        const parsedJson = JSON.parse(body);
        isJson = true;
        jsonFormatted = JSON.stringify(parsedJson, null, 2);
      } catch {
        isJson = false;
      }
    }

    switch (activeLang) {
      case 'fetch': {
        const fetchHeaders =
          Object.keys(headers).length > 0
            ? `  headers: {\n${Object.entries(headers)
                .map(([k, v]) => `    '${k}': '${v}'`)
                .join(',\n')}\n  },`
            : '';

        let fetchBody = '';
        if (body) {
          fetchBody = isJson
            ? `  body: JSON.stringify({\n${jsonFormatted
                .split('\n')
                .slice(1, -1)
                .map((line) => `  ${line}`)
                .join('\n')}\n  })`
            : `  body: '${body}'`;
        }

        const options = [`  method: '${method}'`, fetchHeaders, fetchBody]
          .filter(Boolean)
          .join(',\n');

        return `fetch('${url}', {\n${options}\n})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`;
      }

      case 'axios': {
        const axiosHeaders =
          Object.keys(headers).length > 0
            ? `  headers: {\n${Object.entries(headers)
                .map(([k, v]) => `    '${k}': '${v}'`)
                .join(',\n')}\n  },`
            : '';

        let axiosData = '';
        if (body) {
          axiosData = isJson
            ? `  data: {\n${jsonFormatted
                .split('\n')
                .slice(1, -1)
                .map((line) => `  ${line}`)
                .join('\n')}\n  }`
            : `  data: '${body}'`;
        }

        const options = [
          `  method: '${method.toLowerCase()}'`,
          `  url: '${url}'`,
          axiosHeaders,
          axiosData,
        ]
          .filter(Boolean)
          .join(',\n');

        return `import axios from 'axios';\n\naxios({\n${options}\n})\n  .then(response => {\n    console.log(response.data);\n  })\n  .catch(error => {\n    console.error('Error:', error);\n  });`;
      }

      case 'python': {
        const pythonHeaders =
          Object.keys(headers).length > 0
            ? `headers = {\n${Object.entries(headers)
                .map(([k, v]) => `    '${k}': '${v}'`)
                .join(',\n')}\n}`
            : 'headers = {}';

        let pythonBody = '';
        if (body) {
          pythonBody = isJson
            ? `data = {\n${jsonFormatted
                .split('\n')
                .slice(1, -1)
                .map((line) => `  ${line}`)
                .join('\n')}\n}`
            : `data = """${body}"""`;
        }

        const reqArgs = ['url=url', 'headers=headers'];
        if (body) {
          reqArgs.push(isJson ? 'json=data' : 'data=data');
        }

        return `import requests\nimport json\n\nurl = '${url}'\n${pythonHeaders}\n${body ? pythonBody + '\n' : ''}\nresponse = requests.${method.toLowerCase()}(\n    ${reqArgs.join(',\n    ')}\n)\n\nprint(response.status_code)\nprint(response.json())`;
      }

      case 'go': {
        const goHeaders = Object.entries(headers)
          .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
          .join('\n');

        let goBodySetup = 'nil';
        if (body) {
          goBodySetup = `bytes.NewBuffer(jsonData)`;
        }

        return `package main\n\nimport (\n\t"bytes"\n\t"encoding/json"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n${
          isJson
            ? `\tjsonData := []byte(\`\n${jsonFormatted}\`)\n`
            : body
              ? `\tjsonData := []byte(\`${body}\`)\n`
              : ''
        }\treq, err := http.NewRequest("${method}", "${url}", ${goBodySetup})\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n${goHeaders}\n\n\tclient := &http.Client{}\n\tresp, err := client.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer resp.Body.Close()\n\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(resp.Status)\n\tfmt.Println(string(body))\n}`;
      }
    }
  }, [parsed, activeLang]);

  const handleCopy = () => {
    copy(generatedCode);
  };

  const handleRandomizeSample = (type: 'get' | 'post' | 'auth') => {
    if (type === 'get') {
      setCurlInput(`curl 'https://api.github.com/users/handism'`);
    } else if (type === 'post') {
      setCurlInput(`curl 'https://httpbin.org/post' \\
  -X POST \\
  -H 'Content-Type: application/json' \\
  -d '{"name": "Alice", "job": "Engineer"}'`);
    } else {
      setCurlInput(`curl 'https://api.example.com/me' \\
  -u 'username:secret_token'`);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* コントロール/サンプル */}
        <div className="bg-card border border-border/70 rounded-3xl p-4 md:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-text/60">サンプルを読み込む:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRandomizeSample('get')}
              className="py-1.5 px-3 bg-secondary/50 border border-border text-text/80 rounded-xl text-xs font-semibold hover:bg-secondary transition-all cursor-pointer"
            >
              GET リクエスト
            </button>
            <button
              onClick={() => handleRandomizeSample('post')}
              className="py-1.5 px-3 bg-secondary/50 border border-border text-text/80 rounded-xl text-xs font-semibold hover:bg-secondary transition-all cursor-pointer"
            >
              POST リクエスト (JSON)
            </button>
            <button
              onClick={() => handleRandomizeSample('auth')}
              className="py-1.5 px-3 bg-secondary/50 border border-border text-text/80 rounded-xl text-xs font-semibold hover:bg-secondary transition-all cursor-pointer"
            >
              BASIC 認証付
            </button>
          </div>
        </div>

        {/* メインエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 左側: Curl入力 (5列) */}
          <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/60">
              <h2 className="font-bold text-base md:text-lg flex items-center gap-2">
                <Send className="w-4 h-4 text-accent" /> Curl コマンド入力
              </h2>
              <button
                onClick={() => setCurlInput('')}
                className="text-xs text-text/40 hover:text-red-500 font-semibold cursor-pointer"
              >
                クリア
              </button>
            </div>
            <textarea
              id="curl-textarea"
              rows={12}
              value={curlInput}
              onChange={(e) => setCurlInput(e.target.value)}
              placeholder="ここにcurlコマンドを入力してください..."
              className="w-full bg-secondary border border-border rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-accent resize-none placeholder-text/30"
            />
          </div>

          {/* 右側: ターゲットコード出力 (7列) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md text-slate-100 flex flex-col justify-between">
              {/* 言語切り替え ＆ コピー */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                {/* タブ */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
                  {(
                    [
                      { id: 'fetch', label: 'JS Fetch' },
                      { id: 'axios', label: 'JS Axios' },
                      { id: 'python', label: 'Python' },
                      { id: 'go', label: 'Go Lang' },
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setActiveLang(lang.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeLang === lang.id
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                {/* コピー */}
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer w-full sm:w-auto justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>コードコピー</span>
                    </>
                  )}
                </button>
              </div>

              {/* ターミナル調コード表示 */}
              <div className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-900 overflow-x-auto whitespace-pre leading-relaxed min-h-[220px]">
                {generatedCode}
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold select-none">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  インプットの解析およびコード生成は完全にブラウザのメモリ内で行われます。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
