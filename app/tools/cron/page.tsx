'use client';

import { Terminal, Copy, Info, Check } from 'lucide-react';
import { useState, useMemo } from 'react';

// Matches a single cron part
function matchesCronPart(value: number, part: string, rangeMin: number, rangeMax: number): boolean {
  if (part === '*' || part === '?') return true;

  // Handle list (e.g., 1,2,5)
  const list = part.split(',');
  if (list.length > 1) {
    return list.some((item) => matchesCronPart(value, item, rangeMin, rangeMax));
  }

  // Handle step (e.g., */5, 2-10/3)
  const stepParts = part.split('/');
  const basePart = stepParts[0];
  const step = stepParts[1] ? parseInt(stepParts[1], 10) : 1;

  let start = rangeMin;
  let end = rangeMax;

  if (basePart.includes('-')) {
    const rangeParts = basePart.split('-');
    start = parseInt(rangeParts[0], 10);
    end = parseInt(rangeParts[1], 10);
  } else if (basePart === '*') {
    start = rangeMin;
    end = rangeMax;
  } else {
    start = parseInt(basePart, 10);
    end = start;
  }

  if (value < start || value > end) return false;
  return (value - start) % step === 0;
}

// Calculate the next N executions of the cron expression
function getNextExecutions(cronStr: string, limit = 5): { dates: Date[]; error?: string } {
  const parts = cronStr.trim().replace(/\s+/g, ' ').split(' ');
  if (parts.length !== 5) {
    return {
      dates: [],
      error: 'Cron式はスペース区切りで5つのフィールド（分 時 日 月 曜日）である必要があります。',
    };
  }

  const [minP, hourP, domP, monthP, dowP] = parts;

  // Quick format validation using simple regex
  const validPattern = /^[0-9\*,\/\-?]+$/;
  if (!parts.every((p) => validPattern.test(p))) {
    return {
      dates: [],
      error: '無効な文字が含まれています。数字、*、,、/、-、? のみ使用できます。',
    };
  }

  const dates: Date[] = [];
  const current = new Date();
  current.setSeconds(0);
  current.setMilliseconds(0);

  let maxSearchMinutes = 525600; // Search up to 1 year ahead
  let foundCount = 0;

  while (foundCount < limit && maxSearchMinutes > 0) {
    current.setMinutes(current.getMinutes() + 1);
    maxSearchMinutes--;

    const min = current.getMinutes();
    const hour = current.getHours();
    const dom = current.getDate();
    const month = current.getMonth() + 1; // 1-12
    const dow = current.getDay(); // 0 (Sun) - 6 (Sat)

    // In cron, both 0 and 7 can represent Sunday
    const matchesDow =
      matchesCronPart(dow, dowP, 0, 6) ||
      (dow === 0 && matchesCronPart(7, dowP, 1, 7)) ||
      (dow === 7 && matchesCronPart(0, dowP, 0, 6));

    if (
      matchesCronPart(min, minP, 0, 59) &&
      matchesCronPart(hour, hourP, 0, 23) &&
      matchesCronPart(dom, domP, 1, 31) &&
      matchesCronPart(month, monthP, 1, 12) &&
      matchesDow
    ) {
      dates.push(new Date(current.getTime()));
      foundCount++;
    }
  }

  if (dates.length === 0) {
    return {
      dates: [],
      error:
        '一致する実行予定日が見つかりませんでした（設定が厳しすぎるか、存在しない日の可能性があります）。',
    };
  }

  return { dates };
}

// Describe a single cron part in Japanese
function describePart(part: string, label: string, rangeMin: number, rangeMax: number): string {
  if (part === '*' || part === '?') {
    return `毎${label}`;
  }

  const list = part.split(',');
  if (list.length > 1) {
    return list.map((item) => describePart(item, label, rangeMin, rangeMax)).join(' と ');
  }

  const stepParts = part.split('/');
  const basePart = stepParts[0];
  const step = stepParts[1] ? parseInt(stepParts[1], 10) : null;

  let baseDesc = '';
  if (basePart.includes('-')) {
    const rangeParts = basePart.split('-');
    baseDesc = `${rangeParts[0]}から${rangeParts[1]}まで`;
  } else if (basePart === '*') {
    baseDesc = `毎${label}`;
  } else {
    baseDesc = `${basePart}`;
  }

  if (step !== null) {
    if (basePart === '*') {
      return `${step}${label}おき`;
    }
    return `${baseDesc}から${step}${label}おき`;
  }

  return `${baseDesc}${label}`;
}

const WEEKDAYS_JP = ['日', '月', '火', '水', '木', '金', '土'];
function describeWeekdayPart(part: string): string {
  if (part === '*' || part === '?') {
    return '毎日';
  }
  const list = part.split(',');
  if (list.length > 1) {
    return list.map(describeWeekdayPart).join(' と ');
  }

  if (part.includes('-')) {
    const rangeParts = part.split('-');
    const start = WEEKDAYS_JP[parseInt(rangeParts[0], 10) % 7];
    const end = WEEKDAYS_JP[parseInt(rangeParts[1], 10) % 7];
    return `${start}曜日から${end}曜日まで`;
  }

  const num = parseInt(part, 10) % 7;
  return `${WEEKDAYS_JP[num]}曜日`;
}

// Generates complete description in Japanese
function getCronExplanation(cronStr: string): string {
  const parts = cronStr.trim().replace(/\s+/g, ' ').split(' ');
  if (parts.length !== 5) return '無効なCron式';

  const [minP, hourP, domP, monthP, dowP] = parts;

  const minDesc = describePart(minP, '分', 0, 59);
  const hourDesc = describePart(hourP, '時', 0, 23);
  const domDesc = describePart(domP, '日', 1, 31);
  const monthDesc = describePart(monthP, '月', 1, 12);
  const dowDesc = describeWeekdayPart(dowP);

  // Combine into a readable description
  let explanation = '';
  if (monthP !== '*') explanation += `${monthDesc}の `;
  if (domP !== '*') explanation += `${domDesc} `;
  if (dowP !== '*') explanation += `（${dowDesc}）`;
  if (hourP !== '*') explanation += `${hourDesc} `;
  explanation += `${minDesc}に実行`;

  // Standard cleanup
  if (cronStr === '* * * * *') {
    return '毎分実行（1分ごと）';
  }
  if (minP === '*' && hourP === '*' && domP === '*' && monthP === '*' && dowP === '*') {
    return '毎分実行';
  }

  return explanation;
}

export default function CronGenerator() {
  const [cronInput, setCronInput] = useState('*/5 * * * *');
  const [copied, setCopied] = useState(false);

  // Generator UI state
  const [preset, setPreset] = useState('custom');
  const [genMin, setGenMin] = useState('*/5');
  const [genHour, setGenHour] = useState('*');
  const [genDom, setGenDom] = useState('*');
  const [genMonth, setGenMonth] = useState('*');
  const [genDow, setGenDow] = useState('*');

  const handlePresetChange = (presetVal: string) => {
    setPreset(presetVal);
    let min = genMin;
    let hour = genHour;
    let dom = genDom;
    let month = genMonth;
    let dow = genDow;

    if (presetVal === 'every-min') {
      min = '*';
      hour = '*';
      dom = '*';
      month = '*';
      dow = '*';
    } else if (presetVal === 'every-5min') {
      min = '*/5';
      hour = '*';
      dom = '*';
      month = '*';
      dow = '*';
    } else if (presetVal === 'every-hour') {
      min = '0';
      hour = '*';
      dom = '*';
      month = '*';
      dow = '*';
    } else if (presetVal === 'daily-midnight') {
      min = '0';
      hour = '0';
      dom = '*';
      month = '*';
      dow = '*';
    } else if (presetVal === 'weekly-sunday') {
      min = '0';
      hour = '0';
      dom = '*';
      month = '*';
      dow = '0';
    } else if (presetVal === 'monthly-1st') {
      min = '0';
      hour = '0';
      dom = '1';
      month = '*';
      dow = '*';
    }

    if (presetVal !== 'custom') {
      setGenMin(min);
      setGenHour(hour);
      setGenDom(dom);
      setGenMonth(month);
      setGenDow(dow);
      setCronInput(`${min} ${hour} ${dom} ${month} ${dow}`);
    }
  };

  const updateVisualField = (field: 'min' | 'hour' | 'dom' | 'month' | 'dow', val: string) => {
    setPreset('custom-build');
    let min = genMin;
    let hour = genHour;
    let dom = genDom;
    let month = genMonth;
    let dow = genDow;

    if (field === 'min') {
      min = val;
      setGenMin(val);
    } else if (field === 'hour') {
      hour = val;
      setGenHour(val);
    } else if (field === 'dom') {
      dom = val;
      setGenDom(val);
    } else if (field === 'month') {
      month = val;
      setGenMonth(val);
    } else if (field === 'dow') {
      dow = val;
      setGenDow(val);
    }

    setCronInput(`${min} ${hour} ${dom} ${month} ${dow}`);
  };

  const handleManualInput = (val: string) => {
    setCronInput(val);
    setPreset('custom');
  };

  const explanation = useMemo(() => {
    return getCronExplanation(cronInput);
  }, [cronInput]);

  const predictions = useMemo(() => {
    return getNextExecutions(cronInput);
  }, [cronInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl border border-slate-150 dark:border-slate-800 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Cron Parser & Generator
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                定期実行プログラム（Cron）のスケジュール確認、日本語翻訳、生成を行うことができます。
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Cron Expression Input Area */}
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Cron式 (5フィールド)
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={cronInput}
                  onChange={(e) => handleManualInput(e.target.value)}
                  placeholder="分 時 日 月 曜日 (例: */10 * * * *)"
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-lg font-bold tracking-wide"
                />

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 px-6 py-3 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'コピー完了' : 'コピー'}
                </button>
              </div>

              {/* Japanese Explanation Panel */}
              <div className="mt-4 flex items-start gap-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-150/45 dark:border-emerald-900/30 p-4 rounded-xl">
                <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 block text-xs uppercase tracking-wider mb-1">
                    スケジュールの意味（日本語訳）
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-base">
                    {explanation}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Builder Option */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                GUIでCron式を生成
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Presets */}
                <div className="md:col-span-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between flex-wrap gap-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    プリセット設定
                  </span>
                  <select
                    value={preset}
                    onChange={(e) => handlePresetChange(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white"
                  >
                    <option value="custom">カスタム（個別編集）</option>
                    <option value="every-min">毎分 (* * * * *)</option>
                    <option value="every-5min">5分ごと (*/5 * * * *)</option>
                    <option value="every-hour">毎時 0分に実行 (0 * * * *)</option>
                    <option value="daily-midnight">毎日 深夜0:00に実行 (0 0 * * *)</option>
                    <option value="weekly-sunday">毎週 日曜日 深夜0:00に実行 (0 0 * * 0)</option>
                    <option value="monthly-1st">毎月 1日 深夜0:00に実行 (0 0 1 * *)</option>
                  </select>
                </div>

                {/* Min Selector */}
                <div className="md:col-span-1 flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs text-slate-500 font-bold mb-1.5">分</span>
                  <input
                    type="text"
                    value={genMin}
                    onChange={(e) => updateVisualField('min', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-white rounded text-sm font-mono text-center"
                    placeholder="*"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-1">0 - 59</span>
                </div>

                {/* Hour Selector */}
                <div className="md:col-span-1 flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs text-slate-500 font-bold mb-1.5">時</span>
                  <input
                    type="text"
                    value={genHour}
                    onChange={(e) => updateVisualField('hour', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-white rounded text-sm font-mono text-center"
                    placeholder="*"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-1">0 - 23</span>
                </div>

                {/* Dom Selector */}
                <div className="md:col-span-1 flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs text-slate-500 font-bold mb-1.5">日</span>
                  <input
                    type="text"
                    value={genDom}
                    onChange={(e) => updateVisualField('dom', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-white rounded text-sm font-mono text-center"
                    placeholder="*"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-1">1 - 31</span>
                </div>

                {/* Month Selector */}
                <div className="md:col-span-1 flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs text-slate-500 font-bold mb-1.5">月</span>
                  <input
                    type="text"
                    value={genMonth}
                    onChange={(e) => updateVisualField('month', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-white rounded text-sm font-mono text-center"
                    placeholder="*"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-1">1 - 12</span>
                </div>

                {/* Day of week Selector */}
                <div className="md:col-span-2 flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-xs text-slate-500 font-bold mb-1.5">曜日</span>
                  <input
                    type="text"
                    value={genDow}
                    onChange={(e) => updateVisualField('dow', e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-white rounded text-sm font-mono text-center"
                    placeholder="*"
                  />
                  <span className="text-[10px] text-slate-400 text-center mt-1">0-6 (0=日)</span>
                </div>
              </div>
            </div>

            {/* Run Prediction Panel */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                今後の実行予定スケジュール (JST)
              </h2>

              <div className="bg-slate-950 text-slate-200 border border-slate-800 p-5 rounded-2xl font-mono text-sm leading-relaxed">
                {predictions.error ? (
                  <span className="text-red-400 font-semibold">{predictions.error}</span>
                ) : (
                  <ul className="space-y-2">
                    {predictions.dates.map((date, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-500 select-none">▶</span>
                        <span className="text-slate-500">[{idx + 1}]</span>
                        <span className="text-slate-150">
                          {date.toLocaleString('ja-JP', { weekday: 'short' })}
                        </span>
                        <span className="text-white font-bold">{date.toLocaleString('ja-JP')}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Cron Cheat Sheet */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl">
              <h3 className="font-bold text-slate-850 dark:text-white mb-3 text-sm">
                Cron式 記述ガイド
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-300 mb-1">
                    各フィールドの並び順:
                  </h4>
                  <p className="font-mono text-slate-900 dark:text-slate-250 bg-slate-200/55 dark:bg-slate-800 p-2 rounded">
                    分 時 日 月 曜日
                    <br />* * * * *
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-300 mb-1">
                    主要な記号の意味:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold font-mono">
                        *
                      </code>{' '}
                      : すべての値（毎分、毎時など）
                    </li>
                    <li>
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold font-mono">
                        /
                      </code>{' '}
                      : 間隔の指定（例: <code className="font-mono">*/5</code> = 5ごと）
                    </li>
                    <li>
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold font-mono">
                        ,
                      </code>{' '}
                      : 複数指定（例: <code className="font-mono">1,3,5</code> = 1と3と5）
                    </li>
                    <li>
                      <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold font-mono">
                        -
                      </code>{' '}
                      : 範囲指定（例: <code className="font-mono">1-5</code> = 1から5まで）
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
