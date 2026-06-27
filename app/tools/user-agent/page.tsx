'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { ShieldAlert, Copy, RefreshCw, Monitor, Check } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface UAParseResult {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot / Crawler' | 'Unknown';
  engine: string;
}

// Regex-based lightweight User Agent parser
function parseUserAgent(ua: string): UAParseResult {
  if (!ua) {
    return {
      browser: { name: '不明', version: '' },
      os: { name: '不明', version: '' },
      device: 'Unknown',
      engine: '不明',
    };
  }

  // Detect bots
  const botRegex = /bot|crawler|spider|lighthouse|googlebot|bingbot|yandex|baidu|slurp|facebot/i;
  const isBot = botRegex.test(ua);

  // Detect OS
  let osName = '不明';
  let osVer = '';
  if (/Windows NT/i.test(ua)) {
    osName = 'Windows';
    const match = ua.match(/Windows NT ([\d\.]+)/i);
    osVer = match ? match[1] : '';
    if (osVer === '10.0') osVer = '10 / 11';
    else if (osVer === '6.3') osVer = '8.1';
    else if (osVer === '6.2') osVer = '8';
    else if (osVer === '6.1') osVer = '7';
  } else if (/Macintosh/i.test(ua)) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X ([\d_]+)/i);
    osVer = match ? match[1].replace(/_/g, '.') : '';
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    osName = 'iOS';
    const match = ua.match(/OS ([\d_]+) like Mac OS X/i);
    osVer = match ? match[1].replace(/_/g, '.') : '';
  } else if (/Android/i.test(ua)) {
    osName = 'Android';
    const match = ua.match(/Android ([\d\.]+)/i);
    osVer = match ? match[1] : '';
  } else if (/Linux/i.test(ua)) {
    osName = 'Linux';
  } else if (/CrOS/i.test(ua)) {
    osName = 'ChromeOS';
  }

  // Detect Browser
  let browserName = '不明';
  let browserVer = '';

  if (/Edg/i.test(ua)) {
    browserName = 'Microsoft Edge';
    const match = ua.match(/Edg\/([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (/Chrome|CriOS/i.test(ua)) {
    browserName = 'Google Chrome';
    const match = ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (/Firefox|FxiOS/i.test(ua)) {
    browserName = 'Mozilla Firefox';
    const match = ua.match(/(?:Firefox|FxiOS)\/([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS|Android/i.test(ua)) {
    browserName = 'Safari';
    const match = ua.match(/Version\/([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (/MSIE|Trident/i.test(ua)) {
    browserName = 'Internet Explorer';
    const match = ua.match(/(?:MSIE |rv:)([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (/Opera|OPR/i.test(ua)) {
    browserName = 'Opera';
    const match = ua.match(/(?:Opera|OPR)\/([\d\.]+)/i);
    browserVer = match ? match[1] : '';
  } else if (isBot) {
    const botMatch =
      ua.match(/([a-zA-Z0-9]+bot)\/([\d\.]+)/i) || ua.match(/(googlebot|bingbot)\/([\d\.]+)/i);
    browserName = botMatch ? botMatch[1] : '検索クローラー';
    browserVer = botMatch ? botMatch[2] : '';
  }

  // Detect Device Category
  let device: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot / Crawler' | 'Unknown' = 'Desktop';
  if (isBot) {
    device = 'Bot / Crawler';
  } else if (/iPad/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    device = 'Tablet';
  } else if (/iPhone|iPod|Mobile/i.test(ua)) {
    device = 'Mobile';
  }

  // Detect Engine
  let engine = '不明';
  if (/WebKit/i.test(ua)) {
    engine = 'WebKit';
    if (/Blink|Chrome/i.test(ua) && !/Safari/i.test(ua)) {
      engine = 'Blink';
    }
  } else if (/Gecko/i.test(ua)) {
    engine = 'Gecko';
  } else if (/Trident/i.test(ua)) {
    engine = 'Trident';
  }

  return {
    browser: { name: browserName, version: browserVer },
    os: { name: osName, version: osVer },
    device,
    engine,
  };
}

export default function UserAgentParser() {
  const [uaInput, setUaInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [detectedUa, setDetectedUa] = useState('');

  // Auto-detect browser user agent
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const userAgentStr = navigator.userAgent;
      setTimeout(() => {
        setDetectedUa(userAgentStr);
        setUaInput(userAgentStr);
      }, 0);
    }
  }, []);

  const parsedResult = useMemo(() => {
    return parseUserAgent(uaInput);
  }, [uaInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(uaInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToCurrent = () => {
    setUaInput(detectedUa);
  };

  return (
    <ToolPageLayout
      title="User Agent Parser"
      description="ブラウザが送信するユーザーエージェント（UA）文字列を解析し、OS・ブラウザ・エンジンを調べられます。"
      icon={ShieldAlert}
    >
      {/* Header */}

      <div className="space-y-6">
        {/* Input UA Box */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              User Agent 文字列 (自由に入力・編集可能)
            </label>

            {uaInput !== detectedUa && (
              <button
                onClick={resetToCurrent}
                className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 hover:underline font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                現在の環境のUAに戻す
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <textarea
              value={uaInput}
              onChange={(e) => setUaInput(e.target.value)}
              placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
              className="flex-1 h-28 p-4 border border-slate-250 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none font-mono text-xs shadow-inner resize-y"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Browser */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider block mb-1">
                ブラウザ名 / バージョン
              </span>
              <span className="font-bold text-slate-850 dark:text-white text-lg">
                {parsedResult.browser.name}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-2 block break-all">
              {parsedResult.browser.version ? `v${parsedResult.browser.version}` : 'バージョン不明'}
            </span>
          </div>

          {/* Operating System */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider block mb-1">
                OS名 / バージョン
              </span>
              <span className="font-bold text-slate-850 dark:text-white text-lg">
                {parsedResult.os.name}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-2 block break-all">
              {parsedResult.os.version
                ? `Version ${parsedResult.os.version}`
                : 'バージョン情報なし'}
            </span>
          </div>

          {/* Device Category */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider block mb-1">
                デバイス種別
              </span>
              <span className="font-bold text-slate-850 dark:text-white text-lg flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-slate-400" />
                {parsedResult.device === 'Desktop'
                  ? 'デスクトップ'
                  : parsedResult.device === 'Mobile'
                    ? 'スマートフォン'
                    : parsedResult.device === 'Tablet'
                      ? 'タブレット'
                      : parsedResult.device === 'Bot / Crawler'
                        ? 'クローラー/ボット'
                        : '不明'}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-2 block">
              Category: {parsedResult.device}
            </span>
          </div>

          {/* Rendering Engine */}
          <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider block mb-1">
                レンダリングエンジン
              </span>
              <span className="font-bold text-slate-850 dark:text-white text-lg">
                {parsedResult.engine}
              </span>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-2 block">
              Engine Type
            </span>
          </div>
        </div>

        {/* Copy Current Info Button */}
        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            現在表示しているUA文字列自体をクリップボードに保存する：
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs bg-violet-650 hover:bg-violet-700 text-white font-bold px-4 py-2 rounded-xl transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'コピーしました！' : 'UA文字列をコピー'}
          </button>
        </div>

        {/* Explanation box */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-850 dark:text-white mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            なぜUA判定が必要なのか？
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Webアプリケーション開発において、特定のブラウザ（例:
            古いSafariやIE）や特定のOS環境でのみ発生するバグの調査を行う際に、ユーザーのUA情報は最大のヒントになります。
            また、Googlebotなどのクローラー（ボット）からのアクセスと一般ユーザーを識別して処理を出し分けたり、SEO監査を実行する際にもUA判定は欠かせない要素です。
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
