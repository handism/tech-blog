'use client';

import { useState } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Settings as SettingsIcon,
  History,
  Trash2,
  Volume2,
  VolumeX,
  Coffee,
  CheckCircle,
  XCircle,
  Cog,
} from 'lucide-react';
import { useThemeDesign } from '@/src/components/ThemeDesignProvider';
import { formatTimerTime, usePomodoroTimer } from './usePomodoroTimer';

export default function PomodoroTimer() {
  const { currentTheme } = useThemeDesign();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const {
    workTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    soundEnabled,
    setSoundEnabled,
    tickSoundEnabled,
    setTickSoundEnabled,
    timeLeft,
    totalDuration,
    isActive,
    isWorkSession,
    history,
    toggleTimer,
    resetTimer,
    skipSession,
    clearHistory,
    saveSettings: persistSettings,
  } = usePomodoroTimer(currentTheme);

  const saveSettings = (w: number, b: number) => {
    persistSettings(w, b);
    setShowSettings(false);
  };

  // 進捗率（メーター用）
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = 2 * Math.PI * 90 * (1 - progress);

  // フォーマット時間
  const formattedTime = formatTimerTime(timeLeft);

  // テーマに応じた特化スタイル決定用
  const isSteampunk = currentTheme === 'steampunk';
  const isTerminal = currentTheme === 'terminal';
  const isChalkboard = currentTheme === 'chalkboard';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 左側：タイマー本体 */}
      <div className="lg:col-span-8 flex flex-col items-center">
        {/* タイマー表示コンテナ */}
        <div
          className={`w-full max-w-lg p-8 rounded-3xl border-2 shadow-[6px_6px_0px_0px_var(--border)] dark:shadow-[6px_6px_0px_0px_var(--accent)] transition-all flex flex-col items-center select-none ${
            isSteampunk
              ? 'bg-[#2c1a0e] border-[#c8872a] text-[#f2c680]'
              : isTerminal
                ? 'bg-black border-[#00ff00] text-[#00ff00] font-mono'
                : isChalkboard
                  ? 'bg-[#1e3327] border-dashed border-white/60 text-white font-serif'
                  : 'bg-card border-border text-text'
          }`}
        >
          {/* セッション種別表示 */}
          <div className="flex items-center gap-2 mb-6 font-bold tracking-wider text-sm uppercase">
            {isWorkSession ? (
              <>
                <Timer className="w-5 h-5 animate-pulse" />
                <span>フォーカスセッション (作業)</span>
              </>
            ) : (
              <>
                <Coffee className="w-5 h-5 animate-bounce" />
                <span>リラックスセッション (休憩)</span>
              </>
            )}
          </div>

          {/* タイマーサークルビジュアル */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            {/* Steampunk 歯車背景 */}
            {isSteampunk && (
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Cog
                  className={`w-48 h-48 ${isActive ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '20s' }}
                />
                <Cog
                  className={`w-32 h-32 absolute -top-4 -left-4 ${isActive ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '10s', animationDirection: 'reverse' }}
                />
              </div>
            )}

            {/* 通常テーマ or Steampunk/Chalkboard の進捗サークル */}
            {!isTerminal && (
              <svg className="w-full h-full transform -rotate-90">
                {/* 背景円 */}
                <circle
                  cx="128"
                  cy="128"
                  r="90"
                  className="stroke-current opacity-10"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* 進行円 */}
                <circle
                  cx="128"
                  cy="128"
                  r="90"
                  className="transition-all duration-300 stroke-current"
                  strokeWidth={isSteampunk ? '8' : isChalkboard ? '4' : '10'}
                  strokeDasharray={2 * Math.PI * 90}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap={isChalkboard ? 'square' : 'round'}
                  fill="transparent"
                  style={{
                    stroke: isSteampunk ? '#c8872a' : isChalkboard ? '#ffffff' : 'var(--accent)',
                  }}
                />
              </svg>
            )}

            {/* Terminal アスキーアート円風 */}
            {isTerminal && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none">
                <div className="text-[10px] whitespace-pre font-mono">
                  {` .-----------------. 
/   ..=========..   \\ 
|  /           \\  |
|  |           |  |
|  \\           /  |
\\   ''=========''   /
 '-----------------' `}
                </div>
              </div>
            )}

            {/* タイマーテキスト表示 */}
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className={`font-black tracking-tighter ${
                  isTerminal
                    ? 'text-6xl text-[#00ff00]'
                    : isChalkboard
                      ? 'text-5xl text-white tracking-widest'
                      : isSteampunk
                        ? 'text-5xl text-[#e5a952] font-serif'
                        : 'text-5xl text-text'
                }`}
                style={{
                  fontFamily: isChalkboard ? "'Architects Daughter', Georgia, serif" : undefined,
                }}
              >
                {formattedTime}
              </span>

              {/* 進行状況パーセンテージ（補助） */}
              <span
                className={`text-xs mt-2 opacity-60 font-bold ${
                  isTerminal ? 'text-[#00ff00]' : ''
                }`}
              >
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Terminal 用アスキープログレスバー */}
          {isTerminal && (
            <div className="w-full max-w-xs mb-8">
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span>PROGRESS</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="border border-[#00ff00] p-0.5 rounded font-mono text-[10px] overflow-hidden whitespace-nowrap">
                {`[${'='.repeat(Math.round(progress * 20))}${' '.repeat(20 - Math.round(progress * 20))}]`}
              </div>
            </div>
          )}

          {/* コントロールボタン */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                isSteampunk
                  ? 'bg-[#c8872a] text-[#1a0f07] hover:bg-[#b07420]'
                  : isTerminal
                    ? 'bg-transparent border-2 border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00]/10'
                    : isChalkboard
                      ? 'bg-transparent border border-white text-white hover:bg-white/10'
                      : 'bg-accent text-white hover:shadow-md'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>一時停止</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>スタート</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isSteampunk
                  ? 'bg-[#402a1b] text-[#c8872a] hover:bg-[#4f3622]'
                  : isTerminal
                    ? 'bg-transparent border border-[#00ff00]/60 text-[#00ff00]/80 hover:bg-[#00ff00]/10 hover:text-[#00ff00]'
                    : isChalkboard
                      ? 'bg-transparent text-white/70 hover:text-white hover:underline'
                      : 'bg-secondary text-text hover:bg-secondary/80'
              }`}
              title="タイマーリセット"
            >
              <RotateCcw className="w-4 h-4" />
              <span>リセット</span>
            </button>

            <button
              onClick={skipSession}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isSteampunk
                  ? 'bg-[#402a1b] text-[#c8872a] hover:bg-[#4f3622]'
                  : isTerminal
                    ? 'bg-transparent border border-[#00ff00]/60 text-[#00ff00]/80 hover:bg-[#00ff00]/10 hover:text-[#00ff00]'
                    : isChalkboard
                      ? 'bg-transparent text-white/70 hover:text-white hover:underline'
                      : 'bg-secondary text-text hover:bg-secondary/80'
              }`}
              title="セッションのスキップ"
            >
              <span>スキップ</span>
            </button>
          </div>

          {/* オーディオ・トグルコントロール */}
          <div className="flex gap-4 border-t border-current/10 pt-4 w-full justify-between items-center text-xs opacity-75 font-semibold">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-100"
                title="アラーム音の切替"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>アラーム: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-red-500" />
                    <span>アラーム: OFF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setTickSoundEnabled(!tickSoundEnabled)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-100"
                title="秒針のカチカチ音切替"
              >
                {tickSoundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-accent" />
                    <span>カチカチ音: ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-text/40" />
                    <span>カチカチ音: OFF</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-100"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>時間設定</span>
            </button>
          </div>

          {/* 時間設定オーバーレイフォーム */}
          {showSettings && (
            <div
              className={`mt-4 p-4 border rounded-2xl w-full text-left transition-all ${
                isSteampunk
                  ? 'bg-[#3b2313] border-[#c8872a]/50 text-white'
                  : isTerminal
                    ? 'bg-black border-[#00ff00] text-[#00ff00]'
                    : isChalkboard
                      ? 'bg-[#18281f] border-white/40 text-white'
                      : 'bg-secondary/40 border-border text-text'
              }`}
            >
              <h4 className="font-extrabold text-sm mb-3">タイマーセッション設定</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">作業時間 (分)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={workTime}
                    onChange={(e) => setWorkTime(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">休憩時間 (分)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={breakTime}
                    onChange={(e) => setBreakTime(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-secondary cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => saveSettings(workTime, breakTime)}
                  className="px-3 py-1.5 rounded-lg bg-accent text-white font-bold hover:opacity-90 cursor-pointer"
                >
                  適用
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右側：セッション履歴 */}
      <div className="lg:col-span-4 space-y-6">
        <div className="theme-card p-5 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] dark:shadow-[4px_4px_0px_0px_var(--accent)] flex flex-col h-full min-h-[350px]">
          {/* 履歴ヘッダー */}
          <div className="flex items-center justify-between border-b-2 border-border pb-3 mb-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-text">
              <History className="w-4.5 h-4.5 text-accent" />
              <span>作業・休憩履歴</span>
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-1 rounded-lg hover:bg-secondary text-text/40 hover:text-red-500 transition-colors cursor-pointer"
                title="履歴を削除"
                aria-label="履歴を削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 履歴リスト */}
          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2.5 pr-1">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center text-xs text-text/40 font-bold">
                <span>履歴はありません。</span>
                <span className="font-normal mt-1 opacity-80">
                  完了した作業セッションがここに記録されます。
                </span>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-secondary/30 border border-border/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-black text-text">
                        {item.type === 'work' ? '作業セッション' : '休憩'} ({item.duration}分)
                      </div>
                      <div className="text-[10px] text-text/50">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      item.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400'
                    }`}
                  >
                    {item.status === 'completed' ? '完了' : '中断'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
