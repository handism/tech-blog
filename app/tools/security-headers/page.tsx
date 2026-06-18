'use client';

import { useState, useMemo } from 'react';
import { ShieldCheck, Copy, Check, Info } from 'lucide-react';
import ToolPageLayout from '@/src/components/ToolPageLayout';

type ConfigTab = 'nginx' | 'apache' | 'vercel' | 'netlify';

export default function SecurityHeadersGenerator() {
  // 各種ヘッダー設定のステート
  const [cspEnabled, setCspEnabled] = useState(true);
  const [cspPolicy, setCspPolicy] = useState<'basic' | 'strict' | 'custom'>('basic');
  const [cspCustom, setCspCustom] = useState(
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  const [hstsEnabled, setHstsEnabled] = useState(true);
  const [hstsMaxAge, setHstsMaxAge] = useState(31536000); // 1年
  const [hstsSubdomains, setHstsSubdomains] = useState(true);
  const [hstsPreload, setHstsPreload] = useState(true);

  const [xfoEnabled, setXfoEnabled] = useState(true);
  const [xfoPolicy, setXfoPolicy] = useState<'DENY' | 'SAMEORIGIN'>('SAMEORIGIN');

  const [xctoEnabled, setXctoEnabled] = useState(true);

  const [rpEnabled, setRpEnabled] = useState(true);
  const [rpPolicy, setRpPolicy] = useState('strict-origin-when-cross-origin');

  const [ppEnabled, setPpEnabled] = useState(true);
  const [ppPolicy, setPpPolicy] = useState('camera=(), microphone=(), geolocation=()');

  // タブ管理
  const [activeTab, setActiveTab] = useState<ConfigTab>('nginx');
  const [copied, setCopied] = useState(false);

  // 各ヘッダーのキーと値のペアを算出
  const headers = useMemo(() => {
    const list: { key: string; value: string }[] = [];

    if (cspEnabled) {
      let value = '';
      if (cspPolicy === 'basic') {
        value =
          "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline';";
      } else if (cspPolicy === 'strict') {
        value =
          "default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';";
      } else {
        value = cspCustom;
      }
      list.push({ key: 'Content-Security-Policy', value });
    }

    if (hstsEnabled) {
      let value = `max-age=${hstsMaxAge}`;
      if (hstsSubdomains) value += '; includeSubDomains';
      if (hstsPreload) value += '; preload';
      list.push({ key: 'Strict-Transport-Security', value });
    }

    if (xfoEnabled) {
      list.push({ key: 'X-Frame-Options', value: xfoPolicy });
    }

    if (xctoEnabled) {
      list.push({ key: 'X-Content-Type-Options', value: 'nosniff' });
    }

    if (rpEnabled) {
      list.push({ key: 'Referrer-Policy', value: rpPolicy });
    }

    if (ppEnabled) {
      list.push({ key: 'Permissions-Policy', value: ppPolicy });
    }

    return list;
  }, [
    cspEnabled,
    cspPolicy,
    cspCustom,
    hstsEnabled,
    hstsMaxAge,
    hstsSubdomains,
    hstsPreload,
    xfoEnabled,
    xfoPolicy,
    xctoEnabled,
    rpEnabled,
    rpPolicy,
    ppEnabled,
    ppPolicy,
  ]);

  // 出力コードの生成
  const generatedCode = useMemo(() => {
    switch (activeTab) {
      case 'nginx': {
        const lines = headers.map((h) => `add_header ${h.key} "${h.value}" always;`);
        return `# Nginx Configuration (server block or location block)
${lines.join('\n')}`;
      }
      case 'apache': {
        const lines = headers.map((h) => `Header set ${h.key} "${h.value}"`);
        return `# Apache Configuration (.htaccess or httpd.conf)
<IfModule mod_headers.c>
${lines.map((l) => `  ${l}`).join('\n')}
</IfModule>`;
      }
      case 'vercel': {
        const vercelJson = {
          headers: [
            {
              source: '/(.*)',
              headers: headers.map((h) => ({
                key: h.key,
                value: h.value,
              })),
            },
          ],
        };
        return `// vercel.json
${JSON.stringify(vercelJson, null, 2)}`;
      }
      case 'netlify': {
        const lines = headers.map((h) => `    ${h.key} = "${h.value}"`);
        return `# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
${lines.join('\n')}`;
      }
      default:
        return '';
    }
  }, [headers, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      title="HTTP Security Headers Generator"
      description="Webサイトの安全性を高める各種HTTPセキュリティヘッダーの設定コードを生成します。トグルやパラメータを選ぶだけで、Nginx、Apache、Vercel、Netlify用の設定コードを即座に作成できます。"
      icon={ShieldCheck}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左側：設定項目 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="neo-card p-5 bg-card space-y-5">
            <h3 className="font-extrabold text-sm border-b-2 border-border pb-3">
              🛡️ セキュリティヘッダー設定
            </h3>

            {/* Content-Security-Policy (CSP) */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cspEnabled}
                    onChange={(e) => setCspEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  Content-Security-Policy (CSP)
                </label>
                <span className="text-[10px] text-text/50 font-bold">XSS防御</span>
              </div>
              {cspEnabled && (
                <div className="space-y-2.5 pt-2 pl-5 border-l border-border/10">
                  <div className="flex gap-2">
                    {(
                      [
                        { id: 'basic', label: '標準ポリシー' },
                        { id: 'strict', label: '厳格 (Strict)' },
                        { id: 'custom', label: 'カスタム' },
                      ] as const
                    ).map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setCspPolicy(mode.id)}
                        className={`
                          px-2 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer
                          ${cspPolicy === mode.id ? 'bg-accent text-white border-accent' : 'bg-card text-text border-border'}
                        `}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  {cspPolicy === 'custom' && (
                    <textarea
                      value={cspCustom}
                      onChange={(e) => setCspCustom(e.target.value)}
                      className="w-full text-[10px] p-2 border border-border rounded font-mono bg-card"
                      rows={2}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Strict-Transport-Security (HSTS) */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hstsEnabled}
                    onChange={(e) => setHstsEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  Strict-Transport-Security (HSTS)
                </label>
                <span className="text-[10px] text-text/50 font-bold">HTTPS強制</span>
              </div>
              {hstsEnabled && (
                <div className="space-y-2 pt-2 pl-5 border-l border-border/10 text-[10px] font-bold text-text/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span>期間 (max-age):</span>
                    <select
                      value={hstsMaxAge}
                      onChange={(e) => setHstsMaxAge(Number(e.target.value))}
                      className="border border-border p-1 bg-card rounded"
                    >
                      <option value={31536000}>1年 (31,536,000s)</option>
                      <option value={63072000}>2年 (63,072,000s)</option>
                      <option value={15768000}>半年 (15,768,000s)</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hstsSubdomains}
                        onChange={(e) => setHstsSubdomains(e.target.checked)}
                        className="accent-accent"
                      />
                      サブドメインを含む
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hstsPreload}
                        onChange={(e) => setHstsPreload(e.target.checked)}
                        className="accent-accent"
                      />
                      Preload申請用
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* X-Frame-Options */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={xfoEnabled}
                    onChange={(e) => setXfoEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  X-Frame-Options
                </label>
                <span className="text-[10px] text-text/50 font-bold">クリックジャッキング対策</span>
              </div>
              {xfoEnabled && (
                <div className="flex gap-2 pt-2 pl-5 border-l border-border/10">
                  {(['SAMEORIGIN', 'DENY'] as const).map((policy) => (
                    <button
                      key={policy}
                      onClick={() => setXfoPolicy(policy)}
                      className={`
                        px-2 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer
                        ${xfoPolicy === policy ? 'bg-accent text-white border-accent' : 'bg-card text-text border-border'}
                      `}
                    >
                      {policy}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* X-Content-Type-Options */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={xctoEnabled}
                    onChange={(e) => setXctoEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  X-Content-Type-Options (nosniff)
                </label>
                <span className="text-[10px] text-text/50 font-bold">MIMEスニッフィング防止</span>
              </div>
            </div>

            {/* Referrer-Policy */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rpEnabled}
                    onChange={(e) => setRpEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  Referrer-Policy
                </label>
                <span className="text-[10px] text-text/50 font-bold">リファラ制御</span>
              </div>
              {rpEnabled && (
                <div className="pt-2 pl-5 border-l border-border/10">
                  <select
                    value={rpPolicy}
                    onChange={(e) => setRpPolicy(e.target.value)}
                    className="w-full border border-border p-1 bg-card rounded text-[10px] font-bold"
                  >
                    <option value="no-referrer">no-referrer (送信しない)</option>
                    <option value="same-origin">same-origin (同一オリジンのみ)</option>
                    <option value="strict-origin-when-cross-origin">
                      strict-origin-when-cross-origin (推奨)
                    </option>
                    <option value="unsafe-url">unsafe-url (常に送信)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Permissions-Policy */}
            <div className="space-y-2 p-3 bg-secondary rounded-xl border border-border/10">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ppEnabled}
                    onChange={(e) => setPpEnabled(e.target.checked)}
                    className="accent-accent"
                  />
                  Permissions-Policy
                </label>
                <span className="text-[10px] text-text/50 font-bold">ブラウザ機能制限</span>
              </div>
              {ppEnabled && (
                <div className="pt-2 pl-5 border-l border-border/10">
                  <input
                    type="text"
                    value={ppPolicy}
                    onChange={(e) => setPpPolicy(e.target.value)}
                    className="w-full border border-border p-1 bg-card rounded font-mono text-[10px]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右側：コード生成結果 */}
        <div className="lg:col-span-6 space-y-6">
          <div className="neo-card p-5 bg-card flex flex-col h-[520px]">
            {/* タブメニュー */}
            <div className="flex justify-between items-center border-b-2 border-border pb-3 mb-4">
              <div className="flex gap-1">
                {(['nginx', 'apache', 'vercel', 'netlify'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all uppercase cursor-pointer
                      ${
                        activeTab === tab
                          ? 'bg-accent text-white border-accent'
                          : 'bg-card text-text border-border hover:bg-secondary'
                      }
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="neo-btn p-1.5 text-[10px] flex items-center gap-1 cursor-pointer animate-none"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-accent" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'コピー済' : 'コピー'}</span>
              </button>
            </div>

            {/* コード出力 */}
            <pre className="w-full flex-1 p-4 font-mono text-xs border-2 border-border rounded-xl bg-[#1e1e1e] text-[#f8f8f2] overflow-auto whitespace-pre">
              {generatedCode}
            </pre>

            {/* 推奨アドバイス */}
            <div className="mt-4 p-3 bg-secondary text-[10px] text-text/80 font-bold rounded-lg border border-border/10 flex items-start gap-2">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                HSTSを有効にする場合は、有効なSSL/TLS証明書が設定されていることを事前に確認してください。誤った設定を行うとサイト全体にアクセス不能になる可能性があります。
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
