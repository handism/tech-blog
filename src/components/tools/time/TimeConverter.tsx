// src/components/tools/time/TimeConverter.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Play, Pause, Globe } from 'lucide-react';
import { useCopyToClipboard } from '@/src/hooks/useCopyToClipboard';

const TIMEZONES = [
  { id: 'JST', name: '東京 (JST)', tz: 'Asia/Tokyo', offset: 'UTC+9' },
  { id: 'UTC', name: '世界協定時 (UTC)', tz: 'UTC', offset: 'UTC+0' },
  { id: 'GMT', name: 'ロンドン (GMT/BST)', tz: 'Europe/London', offset: 'UTC+0/+1' },
  { id: 'CET', name: 'パリ (CET/CEST)', tz: 'Europe/Paris', offset: 'UTC+1/+2' },
  { id: 'EST', name: 'ニューヨーク (EST/EDT)', tz: 'America/New_York', offset: 'UTC-5/-4' },
  { id: 'CST', name: 'シカゴ (CST/CDT)', tz: 'America/Chicago', offset: 'UTC-6/-5' },
  { id: 'PST', name: 'ロサンゼルス (PST/PDT)', tz: 'America/Los_Angeles', offset: 'UTC-8/-7' },
  { id: 'IST', name: 'ニューデリー (IST)', tz: 'Asia/Kolkata', offset: 'UTC+5:30' },
  { id: 'SGT', name: 'シンガポール (SGT)', tz: 'Asia/Singapore', offset: 'UTC+8' },
  { id: 'AEST', name: 'シドニー (AEST/AEDT)', tz: 'Australia/Sydney', offset: 'UTC+10/+11' },
];

export default function TimeConverter() {
  const { copy } = useCopyToClipboard();
  const [mounted, setMounted] = useState(false);
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
      const now = new Date();
      setCurrentSec(Math.floor(now.getTime() / 1000));

      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setDateStr(`${yyyy}-${mm}-${dd}`);

      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hh}:${min}:${ss}`);

      setMounted(true);
    }, 0);
  }, []);

  // Live Timer Effect
  useEffect(() => {
    if (!isLive || !mounted) return;
    const interval = setInterval(() => {
      setCurrentSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, mounted]);

  // Convert input timestamp to various formats
  const parsedDateResults = useMemo(() => {
    if (!tsInput) return null;
    const cleanInput = tsInput.trim();
    if (!/^\d+$/.test(cleanInput)) {
      return { error: '半角数字のみ入力してください。' };
    }

    let msVal = parseInt(cleanInput, 10);
    const isSeconds = cleanInput.length <= 11;
    if (isSeconds) {
      msVal *= 1000;
    }

    const date = new Date(msVal);
    if (isNaN(date.getTime())) {
      return { error: '無効なタイムスタンプです。' };
    }

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
    copy(text);
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

  const getZoneTime = (unixSec: number, tzString: string) => {
    const date = new Date(unixSec * 1000);
    try {
      return date.toLocaleString('ja-JP', {
        timeZone: tzString,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return date.toUTCString();
    }
  };

  if (!mounted) {
    return <div className="text-center py-12 text-text/60 font-bold">初期化中...</div>;
  }

  return (
    <div className="space-y-8 text-text animate-none">
      {/* Current Live Time Card */}
      <div className="bg-card border-2 border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-black text-accent uppercase tracking-widest block">
            現在のUnixタイムスタンプ (秒)
          </span>
          <div className="text-3xl md:text-4xl font-black font-mono tracking-wider text-text">
            {currentSec}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] cursor-pointer transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isLive ? 'bg-accent text-white' : 'bg-secondary hover:bg-border/20'
            }`}
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isLive ? '一時停止' : '再開'}
          </button>
          <button
            onClick={setInputToCurrent}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-black bg-secondary border-2 border-border rounded-xl shadow-[2px_2px_0px_0px_var(--border)] hover:bg-border/20 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            変換入力へコピー
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 左側: 変換系 (7列) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Timestamp -> DateTime Converter */}
          <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
            <div className="border-b-2 border-border/20 pb-3">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                🕰️ Timestamp ➔ 日時 変換
              </h2>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-text/80">
                Unixタイムスタンプ (秒 または ミリ秒)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => setTsInput(e.target.value)}
                  placeholder="例: 1718625600"
                  className="flex-1 px-4 py-2.5 border-2 border-border bg-card text-text placeholder-text/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm font-bold shadow-inner"
                />
                <button
                  onClick={() => setTsInput(String(currentSec))}
                  className="px-3 bg-secondary hover:bg-border/25 border-2 border-border rounded-xl transition cursor-pointer flex items-center justify-center shadow-[2px_2px_0px_0px_var(--border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  title="現在時刻を入力"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {parsedDateResults && (
              <div className="space-y-4 bg-secondary/35 border-2 border-border p-4 rounded-2xl shadow-sm">
                {parsedDateResults.error ? (
                  <p className="text-xs text-red-500 font-bold">{parsedDateResults.error}</p>
                ) : (
                  <div className="space-y-3.5 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-text/50 uppercase tracking-wider block">
                        自動判定単位
                      </span>
                      <span className="font-mono text-[10px] bg-accent/15 text-accent border border-accent/25 px-2 py-0.5 rounded shadow-sm">
                        {parsedDateResults.modeGuess}
                      </span>
                    </div>

                    <div className="relative border-t border-border/10 pt-3">
                      <span className="text-text/50 uppercase tracking-wider block">
                        ローカル日時 (JST)
                      </span>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-mono text-text break-all text-sm font-extrabold">
                          {parsedDateResults.local}
                        </span>
                        <button
                          onClick={() => handleCopy(parsedDateResults.local || '', 'local')}
                          className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold shrink-0"
                        >
                          {tsCopied === 'local' ? '完了' : 'コピー'}
                        </button>
                      </div>
                    </div>

                    <div className="relative border-t border-border/10 pt-3">
                      <span className="text-text/50 uppercase tracking-wider block">
                        UTC日時 (世界協定時)
                      </span>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-mono text-text break-all text-sm font-extrabold">
                          {parsedDateResults.utc}
                        </span>
                        <button
                          onClick={() => handleCopy(parsedDateResults.utc || '', 'utc')}
                          className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold shrink-0"
                        >
                          {tsCopied === 'utc' ? '完了' : 'コピー'}
                        </button>
                      </div>
                    </div>

                    <div className="relative border-t border-border/10 pt-3">
                      <span className="text-text/50 uppercase tracking-wider block">
                        ISO 8601 形式
                      </span>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="font-mono text-text break-all text-sm font-extrabold">
                          {parsedDateResults.iso}
                        </span>
                        <button
                          onClick={() => handleCopy(parsedDateResults.iso || '', 'iso')}
                          className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold shrink-0"
                        >
                          {tsCopied === 'iso' ? '完了' : 'コピー'}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-border/10 pt-3 flex items-center justify-between">
                      <span className="text-text/50 uppercase tracking-wider block">相対時間</span>
                      <span className="text-text mt-1 block text-sm font-extrabold">
                        {parsedDateResults.relative}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DateTime -> Timestamp Converter */}
          <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
            <div className="border-b-2 border-border/20 pb-3">
              <h2 className="text-base font-extrabold flex items-center gap-2">
                🕰️ 日時 ➔ Timestamp 変換
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text/80 uppercase tracking-wider">
                  日付
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-1 focus:ring-accent text-sm font-bold shadow-inner"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text/80 uppercase tracking-wider">
                  時間 (24時間表記)
                </label>
                <input
                  type="text"
                  value={timeStr}
                  onChange={(e) => setTimeStr(e.target.value)}
                  placeholder="hh:mm:ss"
                  className="w-full px-3 py-2 border-2 border-border bg-card text-text rounded-xl focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm font-bold shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setTzSelect('local')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-border transition cursor-pointer shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none ${
                    tzSelect === 'local'
                      ? 'bg-accent text-white shadow-none'
                      : 'bg-card hover:bg-border/10'
                  }`}
                >
                  ローカル (JST)
                </button>
                <button
                  onClick={() => setTzSelect('utc')}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg border-2 border-border transition cursor-pointer shadow-[1.5px_1.5px_0px_0px_var(--border)] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none ${
                    tzSelect === 'utc'
                      ? 'bg-accent text-white shadow-none'
                      : 'bg-card hover:bg-border/10'
                  }`}
                >
                  世界協定時 (UTC)
                </button>
              </div>

              <button
                onClick={handleSetDateToNow}
                className="text-xs font-black text-accent hover:underline cursor-pointer"
              >
                現在日時にリセット
              </button>
            </div>

            {dateToTsResult && (
              <div className="space-y-4 bg-secondary/35 border-2 border-border p-4 rounded-2xl shadow-sm">
                {dateToTsResult.error ? (
                  <p className="text-xs text-red-500 font-bold">{dateToTsResult.error}</p>
                ) : (
                  <div className="space-y-4 text-xs font-bold">
                    <div className="relative">
                      <span className="text-text/50 uppercase tracking-wider block">
                        エポック秒 (10桁)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-lg font-black text-text">
                          {dateToTsResult.sec}
                        </span>
                        <button
                          onClick={() => handleCopy(dateToTsResult.sec || '', 'sec')}
                          className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold shrink-0"
                        >
                          {tsCopied === 'sec' ? '完了' : 'コピー'}
                        </button>
                      </div>
                    </div>

                    <div className="relative border-t border-border/15 pt-3">
                      <span className="text-text/50 uppercase tracking-wider block">
                        エポックミリ秒 (13桁)
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-mono text-lg font-black text-text">
                          {dateToTsResult.ms}
                        </span>
                        <button
                          onClick={() => handleCopy(dateToTsResult.ms || '', 'ms')}
                          className="theme-btn p-1.5 text-[10px] bg-secondary border-border text-text flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] font-bold shrink-0"
                        >
                          {tsCopied === 'ms' ? '完了' : 'コピー'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右側: タイムゾーン一覧 & ガイド (5列) */}
        <div className="lg:col-span-5 space-y-8">
          {/* 世界の現在時刻一覧 */}
          <div className="theme-card p-6 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
            <div className="border-b-2 border-border/20 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent" />
              <h2 className="text-base font-extrabold">🌐 世界主要都市の現在時刻</h2>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {TIMEZONES.map((tzInfo) => {
                const zoneTime = getZoneTime(currentSec, tzInfo.tz);
                return (
                  <div
                    key={tzInfo.id}
                    className="p-3 bg-secondary/35 border-2 border-border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 shadow-sm font-bold group hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <span className="text-xs font-black text-text">{tzInfo.name}</span>
                      <span className="block text-[9px] text-text/40">{tzInfo.offset}</span>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span className="font-mono text-xs font-extrabold text-accent bg-card border border-border/80 px-2 py-0.5 rounded shadow-sm">
                        {zoneTime}
                      </span>
                      <button
                        onClick={() => handleCopy(zoneTime, tzInfo.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity theme-btn p-1 text-[9px] bg-secondary border-border text-text flex items-center cursor-pointer shadow-[1px_1px_0px_0px_var(--border)] shrink-0"
                      >
                        {tsCopied === tzInfo.id ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-card border-2 border-border rounded-3xl p-6 shadow-[4px_4px_0px_0px_var(--border)] text-xs font-bold leading-relaxed space-y-2">
            <h3 className="font-black text-sm mb-2 text-accent">Unixタイムスタンプとは？</h3>
            <p className="text-text/75 leading-normal">
              協定世界時（UTC）の1970年1月1日午前0時0分0秒から経過した秒数（またはミリ秒数）です。
              うるう秒を除いた単純な通算秒であるため、プログラミングやログ解析において広く使われています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
