'use client';

import ToolPageLayout from '@/src/components/ToolPageLayout';
import { Clock, Copy, RefreshCw, Play, Pause } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

export default function UnixTimestampConverter() {
  const [currentSec, setCurrentSec] = useState<number>(0);
  const [isLive, setIsLive] = useState(true);

  // Timestamp to Date state
  const [tsInput, setTsInput] = useState('');
  const [tsCopied, setTsCopied] = useState<string | null>(null);

  // Date to Timestamp state
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [tzSelect, setTzSelect] = useState<'local' | 'utc'>('local');

  // Initialize clock and current input placeholders
  useEffect(() => {
    setTimeout(() => {
      setCurrentSec(Math.floor(Date.now() / 1000));

      // Set default date inputs to current time
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setDateStr(`${yyyy}-${mm}-${dd}`);

      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${min}:${ss}`);
    }, 0);
  }, []);

  // Live Timer Effect
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setCurrentSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Convert input timestamp to various formats
  const parsedDateResults = useMemo(() => {
    if (!tsInput) return null;
    const cleanInput = tsInput.trim();
    if (!/^\d+$/.test(cleanInput)) {
      return { error: '半角数字のみ入力してください。' };
    }

    let msVal = parseInt(cleanInput, 10);
    // Guess if it's in seconds or milliseconds
    const isSeconds = cleanInput.length <= 11;
    if (isSeconds) {
      msVal *= 1000;
    }

    const date = new Date(msVal);
    if (isNaN(date.getTime())) {
      return { error: '無効なタイムスタンプです。' };
    }

    // Relative time
    const diffMs = currentSec * 1000 - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    let relative = '';
    if (Math.abs(diffSec) < 60) {
      relative = diffSec >= 0 ? `${diffSec}秒前` : `${Math.abs(diffSec)}秒後`;
    } else {
      const diffMin = Math.floor(diffSec / 60);
      if (Math.abs(diffMin) < 60) {
        relative = diffMin >= 0 ? `${diffMin}分前` : `${Math.abs(diffMin)}分後`;
      } else {
        const diffHrs = Math.floor(diffMin / 60);
        if (Math.abs(diffHrs) < 24) {
          relative = diffHrs >= 0 ? `${diffHrs}時間前` : `${Math.abs(diffHrs)}時間後`;
        } else {
          const diffDays = Math.floor(diffHrs / 24);
          relative = diffDays >= 0 ? `${diffDays}日前` : `${Math.abs(diffDays)}日後`;
        }
      }
    }

    return {
      local: date.toLocaleString('ja-JP', { timeZoneName: 'short' }),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative,
      modeGuess: isSeconds ? '秒 (10桁/11桁)' : 'ミリ秒 (13桁)',
    };
  }, [tsInput, currentSec]);

  // Convert date inputs to timestamp
  const dateToTsResult = useMemo(() => {
    if (!dateStr || !timeStr) return null;

    try {
      const datetimeString = `${dateStr}T${timeStr}`;
      let date: Date;

      if (tzSelect === 'utc') {
        date = new Date(datetimeString + 'Z');
      } else {
        date = new Date(datetimeString);
      }

      if (isNaN(date.getTime())) {
        return { error: '正しい日時を入力してください。' };
      }

      const msVal = date.getTime();
      const secVal = Math.floor(msVal / 1000);

      return {
        sec: String(secVal),
        ms: String(msVal),
      };
    } catch {
      return { error: '日付の解析に失敗しました。' };
    }
  }, [dateStr, timeStr, tzSelect]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setTsCopied(key);
    setTimeout(() => setTsCopied(null), 1500);
  };

  const setInputToCurrent = () => {
    setTsInput(String(currentSec));
  };

  const handleSetDateToNow = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setDateStr(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setTimeStr(`${hh}:${min}:${ss}`);
  };

  return (
    <ToolPageLayout
      title="Unix Timestamp Converter"
      description="Unixエポックタイムスタンプと日時の相互変換を簡単に行えるツールです。"
      icon={Clock}
    >
      {/* Header */}

      {/* Current Live Time Card */}
      <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
            現在のUnixタイムスタンプ (秒)
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-wider">
            {currentSec}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition ${
              isLive
                ? 'bg-amber-600 text-white hover:bg-amber-750'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? '一時停止' : '再開'}
          </button>
          <button
            onClick={setInputToCurrent}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-200 rounded-lg transition"
          >
            変換入力へコピー
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timestamp -> DateTime Converter */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Timestamp ➔ 日時 変換
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              タイムスタンプを入力して日時にデコードします。
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Unixタイムスタンプ
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder="例: 1718625600"
                className="flex-1 px-4 py-3 border border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-sm"
              />
              <button
                onClick={() => setTsInput(String(currentSec))}
                className="px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-200 rounded-xl border border-slate-250 dark:border-slate-800 transition"
                title="現在時刻を入力"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {parsedDateResults && (
            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
              {parsedDateResults.error ? (
                <p className="text-sm text-red-650 font-semibold">{parsedDateResults.error}</p>
              ) : (
                <div className="space-y-3.5 text-sm">
                  <div>
                    <span className="text-xs text-slate-450 block font-bold">自動判定単位</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {parsedDateResults.modeGuess}
                    </span>
                  </div>

                  <div className="group relative">
                    <span className="text-xs text-slate-450 block font-bold">
                      ローカル日時 (JST)
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-slate-900 dark:text-white break-all">
                        {parsedDateResults.local}
                      </span>
                      <button
                        onClick={() => handleCopy(parsedDateResults.local || '', 'local')}
                        className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-350 p-1.5 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {tsCopied === 'local' && (
                      <span className="absolute right-0 -top-4 text-xs text-emerald-500 font-bold">
                        コピーしました！
                      </span>
                    )}
                  </div>

                  <div className="group relative">
                    <span className="text-xs text-slate-450 block font-bold">
                      UTC日時 (世界協定時)
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-slate-900 dark:text-white break-all">
                        {parsedDateResults.utc}
                      </span>
                      <button
                        onClick={() => handleCopy(parsedDateResults.utc || '', 'utc')}
                        className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-350 p-1.5 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {tsCopied === 'utc' && (
                      <span className="absolute right-0 -top-4 text-xs text-emerald-500 font-bold">
                        コピーしました！
                      </span>
                    )}
                  </div>

                  <div className="group relative">
                    <span className="text-xs text-slate-450 block font-bold">ISO 8601 形式</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-slate-900 dark:text-white break-all">
                        {parsedDateResults.iso}
                      </span>
                      <button
                        onClick={() => handleCopy(parsedDateResults.iso || '', 'iso')}
                        className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-350 p-1.5 rounded transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {tsCopied === 'iso' && (
                      <span className="absolute right-0 -top-4 text-xs text-emerald-500 font-bold">
                        コピーしました！
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-xs text-slate-450 block font-bold">相対時間</span>
                    <span className="font-semibold text-slate-900 dark:text-white mt-1 block">
                      {parsedDateResults.relative}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DateTime -> Timestamp Converter */}
        <div className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              日時 ➔ Timestamp 変換
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              年月日と時刻からタイムスタンプを生成します。
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  日付
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  時間 (24時間表記)
                </label>
                <input
                  type="text"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  placeholder="hh:mm:ss"
                  className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setTzSelect('local')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    tzSelect === 'local'
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-slate-250 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  ローカル (JST)
                </button>
                <button
                  onClick={() => setTzSelect('utc')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    tzSelect === 'utc'
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-slate-250 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  世界協定時 (UTC)
                </button>
              </div>

              <button
                onClick={handleSetDateToNow}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                現在の日時にリセット
              </button>
            </div>

            {dateToTsResult && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl">
                {dateToTsResult.error ? (
                  <p className="text-sm text-red-650 font-semibold">{dateToTsResult.error}</p>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div className="relative">
                      <span className="text-xs text-slate-450 block font-bold">
                        エポック秒 (10桁)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                          {dateToTsResult.sec}
                        </span>
                        <button
                          onClick={() => handleCopy(dateToTsResult.sec || '', 'sec')}
                          className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-350 p-1.5 rounded transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {tsCopied === 'sec' && (
                        <span className="absolute right-0 -top-4 text-xs text-emerald-500 font-bold">
                          コピーしました！
                        </span>
                      )}
                    </div>

                    <div className="relative border-t border-slate-200 dark:border-slate-800 pt-3">
                      <span className="text-xs text-slate-450 block font-bold">
                        エポックミリ秒 (13桁)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                          {dateToTsResult.ms}
                        </span>
                        <button
                          onClick={() => handleCopy(dateToTsResult.ms || '', 'ms')}
                          className="text-xs bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-350 p-1.5 rounded transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {tsCopied === 'ms' && (
                        <span className="absolute right-0 -top-4 text-xs text-emerald-500 font-bold">
                          コピーしました！
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation block */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl mt-8">
        <h3 className="font-bold text-slate-850 dark:text-white mb-2">Unixタイムスタンプとは？</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          協定世界時（UTC）での1970年1月1日午前0時0分0秒（Unixエポック）から経過した秒数、またはミリ秒数で日時を表現するシステムです。
          うるう秒を除いた単純な通算秒であるため、プログラミングやデータベース処理、ログ記録などで非常に広く使われています。
        </p>
      </div>
    </ToolPageLayout>
  );
}
