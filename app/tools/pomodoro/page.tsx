'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
import ToolPageLayout from '@/src/components/ToolPageLayout';
import { useThemeDesign } from '@/src/components/ThemeDesignProvider';

interface PomodoroHistoryItem {
  id: string;
  type: 'work' | 'break';
  duration: number; // in minutes
  timestamp: string; // ISO string
  status: 'completed' | 'interrupted';
}

export default function PomodoroTool() {
  const { currentTheme } = useThemeDesign();

  // 設定用ステート
  const [workTime, setWorkTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pomodoro_work_time');
      return saved ? Number(saved) : 25;
    }
    return 25;
  });
  const [breakTime, setBreakTime] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pomodoro_break_time');
      return saved ? Number(saved) : 5;
    }
    return 5;
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);

  // タイマー状態
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedWork = localStorage.getItem('pomodoro_work_time');
      const work = savedWork ? Number(savedWork) : 25;
      return work * 60;
    }
    return 25 * 60;
  });
  const [totalDuration, setTotalDuration] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedWork = localStorage.getItem('pomodoro_work_time');
      const work = savedWork ? Number(savedWork) : 25;
      return work * 60;
    }
    return 25 * 60;
  });
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWorkSession, setIsWorkSession] = useState<boolean>(true);
  const [history, setHistory] = useState<PomodoroHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pomodoro_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // タイトルにカウントダウンを表示する効果
  useEffect(() => {
    const formatTitleTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const originalTitle = document.title;
    if (isActive) {
      const statusLabel = isWorkSession ? '作業中' : '休憩中';
      document.title = `(${formatTitleTime(timeLeft)}) ${statusLabel} | ${originalTitle.split(' | ').pop()}`;
    } else {
      document.title = originalTitle.includes('|')
        ? originalTitle
        : `Pomodoro Focus Timer | ${originalTitle}`;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [timeLeft, isActive, isWorkSession]);

  // Web Audio API 音声再生
  const playSound = useCallback(
    (type: 'tick' | 'complete') => {
      if (!soundEnabled && type === 'complete') return;
      if (!tickSoundEnabled && type === 'tick') return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        if (type === 'tick') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          if (currentTheme === 'steampunk') {
            // カチッという低めの機械式ギアの音
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          } else if (currentTheme === 'terminal') {
            // 8bit風ビープティック
            osc.type = 'square';
            osc.frequency.setValueAtTime(880, now);
            gain.gain.setValueAtTime(0.006, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          } else if (currentTheme === 'chalkboard') {
            // チョークで点を書くような音
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2200, now);
            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          } else {
            // デフォルト（モダン・ソフトな音）
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            gain.gain.setValueAtTime(0.006, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
          }

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'complete') {
          if (currentTheme === 'steampunk') {
            // レトロ真鍮ベルの音
            const freqs = [220, 275, 330, 440];
            freqs.forEach((f, index) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(f, now);
              const volume = 0.12 / (index + 1);
              gain.gain.setValueAtTime(volume, now);
              gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 2.0);
            });
          } else if (currentTheme === 'terminal') {
            // 8bitビープメロディ（ドミソド）
            const playBeep = (freq: number, duration: number, delay: number) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'square';
              osc.frequency.setValueAtTime(freq, now + delay);
              gain.gain.setValueAtTime(0.08, now + delay);
              gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + delay);
              osc.stop(now + delay + duration + 0.1);
            };
            playBeep(523.25, 0.12, 0); // C5
            playBeep(659.25, 0.12, 0.15); // E5
            playBeep(783.99, 0.12, 0.3); // G5
            playBeep(1046.5, 0.25, 0.45); // C6
          } else if (currentTheme === 'chalkboard') {
            // 学校のチャイム（キーンコーンカーンコーン： Westminster Chime）
            const notes = [
              { f: 329.63, d: 0.6, start: 0 }, // E4
              { f: 261.63, d: 0.6, start: 0.6 }, // C4
              { f: 293.66, d: 0.6, start: 1.2 }, // D4
              { f: 196.0, d: 0.8, start: 1.8 }, // G3
            ];
            notes.forEach((n) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(n.f, now + n.start);
              gain.gain.setValueAtTime(0.12, now + n.start);
              gain.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.d);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + n.start);
              osc.stop(now + n.start + n.d + 0.1);
            });
          } else {
            // デフォルト: 綺麗なクリスタルチャイム
            const playChime = (freq: number, delay: number) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + delay);
              gain.gain.setValueAtTime(0.08, now + delay);
              gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + delay);
              osc.stop(now + delay + 0.9);
            };
            playChime(880, 0);
            playChime(1320, 0.1);
          }
        }
      } catch (e) {
        console.warn('AudioContext execution failed', e);
      }
    },
    [soundEnabled, tickSoundEnabled, currentTheme]
  );

  // セッション終了ハンドラ
  const handleSessionComplete = useCallback(() => {
    playSound('complete');

    const newItem: PomodoroHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: isWorkSession ? 'work' : 'break',
      duration: isWorkSession ? workTime : breakTime,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };

    const newHistory = [newItem, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('pomodoro_history', JSON.stringify(newHistory));

    // セッションの切り替え
    setIsWorkSession(!isWorkSession);
    const nextTime = (isWorkSession ? breakTime : workTime) * 60;
    setTimeLeft(nextTime);
    setTotalDuration(nextTime);
  }, [isWorkSession, workTime, breakTime, history, playSound]);

  // タイマーのカウントダウン制御（リアクティブな setTimeout 方式）
  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          handleSessionComplete();
          return 0;
        }
        playSound('tick');
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    isActive,
    timeLeft,
    isWorkSession,
    workTime,
    breakTime,
    history,
    playSound,
    handleSessionComplete,
  ]);

  // タイマーのコントロール
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // 中断ログを保存（作業が5秒以上経過していた場合のみ）
    const elapsed = totalDuration - timeLeft;
    if (elapsed > 5 && timeLeft > 0) {
      const newItem: PomodoroHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: isWorkSession ? 'work' : 'break',
        duration: Math.round((elapsed / 60) * 10) / 10,
        timestamp: new Date().toISOString(),
        status: 'interrupted',
      };
      const newHistory = [newItem, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem('pomodoro_history', JSON.stringify(newHistory));
    }

    const currentDuration = (isWorkSession ? workTime : breakTime) * 60;
    setTimeLeft(currentDuration);
    setTotalDuration(currentDuration);
  };

  const skipSession = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // スキップされた場合は中断として記録
    const elapsed = totalDuration - timeLeft;
    const newItem: PomodoroHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: isWorkSession ? 'work' : 'break',
      duration: Math.round((elapsed / 60) * 10) / 10 || 0.1,
      timestamp: new Date().toISOString(),
      status: 'interrupted',
    };
    const newHistory = [newItem, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('pomodoro_history', JSON.stringify(newHistory));

    // セッションの反転
    const nextSession = !isWorkSession;
    setIsWorkSession(nextSession);
    const nextDuration = (nextSession ? workTime : breakTime) * 60;
    setTimeLeft(nextDuration);
    setTotalDuration(nextDuration);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('pomodoro_history');
  };

  const saveSettings = (w: number, b: number) => {
    const validW = Math.max(1, Math.min(180, w));
    const validB = Math.max(1, Math.min(60, b));
    setWorkTime(validW);
    setBreakTime(validB);
    localStorage.setItem('pomodoro_work_time', validW.toString());
    localStorage.setItem('pomodoro_break_time', validB.toString());
    setShowSettings(false);

    // タイマーが動いていない時は更新
    if (!isActive) {
      const nextDuration = (isWorkSession ? validW : validB) * 60;
      setTimeLeft(nextDuration);
      setTotalDuration(nextDuration);
    }
  };

  // 進捗率（メーター用）
  const progress = timeLeft / totalDuration;
  const strokeDashoffset = 2 * Math.PI * 90 * (1 - progress);

  // フォーマット時間
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // テーマに応じた特化スタイル決定用
  const isSteampunk = currentTheme === 'steampunk';
  const isTerminal = currentTheme === 'terminal';
  const isChalkboard = currentTheme === 'chalkboard';

  return (
    <ToolPageLayout
      title="Pomodoro Focus Timer"
      description="25分の作業セッションと5分の休憩セッションを繰り返し、集中力を維持するための時間管理ツールです。選択されたテーマ（Steampunk、Terminal、Chalkboardなど）に応じて外見や効果音が変化します。"
      icon={Timer}
    >
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
    </ToolPageLayout>
  );
}
