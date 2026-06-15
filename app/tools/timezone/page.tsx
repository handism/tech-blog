'use client';

import { Clock } from 'lucide-react';
import { useState } from 'react';

const DEFAULT_TIMEZONES: Record<string, string> = {
  UTC: 'UTC+0',
  JST: 'UTC+9',
  EST: 'UTC-5',
  CST: 'UTC-6',
  MST: 'UTC-7',
  PST: 'UTC-8',
  GMT: 'UTC+0',
  CET: 'UTC+1',
  IST: 'UTC+5:30',
  SGT: 'UTC+8',
  AEST: 'UTC+10',
};

const getInitialTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace('T', ' ');
};

export default function TimezoneConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [localTime, setLocalTime] = useState(getInitialTime());
  const [utcTime, setUtcTime] = useState(getInitialTime());
  const [timezones] = useState<Record<string, string>>(DEFAULT_TIMEZONES);

  const handleNow = () => {
    const now = new Date();
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
    updateTimeDisplay(Math.floor(now.getTime() / 1000));
  };

  const updateTimeDisplay = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000);
    setUtcTime(date.toISOString().slice(0, 19).replace('T', ' '));
    setLocalTime(
      date
        .toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '-')
        .replace(/(\d{4})-(\d{2})-(\d{2})\s/, '$1-$2-$3 ')
    );
  };

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimestamp(value);
    if (value && !isNaN(Number(value))) {
      updateTimeDisplay(Math.floor(Number(value)));
    }
  };

  const handleDatetimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      const unixTimestamp = Math.floor(date.getTime() / 1000);
      setTimestamp(unixTimestamp.toString());
      updateTimeDisplay(unixTimestamp);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">タイムゾーン変換</h1>
          </div>

          <div className="space-y-6">
            {/* Unix タイムスタンプ入力 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Unix タイムスタンプ
              </h2>
              <div className="space-y-3">
                <input
                  type="number"
                  value={timestamp}
                  onChange={handleTimestampChange}
                  placeholder="Unix タイムスタンプを入力（秒）"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  現在時刻を設定
                </button>
              </div>
            </div>

            {/* 日時入力 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                日時から変換
              </h2>
              <input
                type="datetime-local"
                onChange={handleDatetimeChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-500 dark:bg-slate-600 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 結果表示 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-2">
                  UTC 時刻
                </h3>
                <p className="text-lg font-mono text-slate-900 dark:text-white break-all">
                  {utcTime}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-green-600 dark:text-green-300 mb-2">
                  ローカル時刻（JST）
                </h3>
                <p className="text-lg font-mono text-slate-900 dark:text-white break-all">
                  {localTime}
                </p>
              </div>
            </div>

            {/* タイムゾーン早見表 */}
            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                タイムゾーン早見表
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(timezones).map(([zone, offset]) => (
                  <div
                    key={zone}
                    className="flex justify-between items-center p-3 bg-white dark:bg-slate-600 rounded border border-slate-200 dark:border-slate-500"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{zone}</span>
                    <span className="text-slate-600 dark:text-slate-300">{offset}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
