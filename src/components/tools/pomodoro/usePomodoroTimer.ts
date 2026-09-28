'use client';

import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/src/config/storage-keys';
import type { ThemeId } from '@/src/config/themes';
import { safeReadFromStorage, safeRemoveFromStorage, safeWriteToStorage } from '@/src/lib/storage';
import { playPomodoroSound, type PomodoroSound } from './pomodoro-sounds';

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const MAX_HISTORY_ITEMS = 50;

export interface PomodoroHistoryItem {
  id: string;
  type: 'work' | 'break';
  duration: number; // in minutes
  timestamp: string; // ISO string
  status: 'completed' | 'interrupted';
}

/**
 * 秒数を `MM:SS` 形式にフォーマットする。
 */
export function formatTimerTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function createHistoryItem(
  isWorkSession: boolean,
  duration: number,
  status: PomodoroHistoryItem['status']
): PomodoroHistoryItem {
  return {
    id: Math.random().toString(36).substring(2, 9),
    type: isWorkSession ? 'work' : 'break',
    duration,
    timestamp: new Date().toISOString(),
    status,
  };
}

/**
 * ポモドーロタイマーの状態管理（カウントダウン・セッション切り替え・履歴・設定の永続化・効果音）。
 */
export function usePomodoroTimer(currentTheme: ThemeId) {
  // 設定
  const [workTime, setWorkTime] = useState<number>(() =>
    safeReadFromStorage(STORAGE_KEYS.pomodoroWorkTime, DEFAULT_WORK_MINUTES)
  );
  const [breakTime, setBreakTime] = useState<number>(() =>
    safeReadFromStorage(STORAGE_KEYS.pomodoroBreakTime, DEFAULT_BREAK_MINUTES)
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickSoundEnabled, setTickSoundEnabled] = useState<boolean>(false);

  // タイマー状態
  const [timeLeft, setTimeLeft] = useState<number>(() => workTime * 60);
  const [totalDuration, setTotalDuration] = useState<number>(() => workTime * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWorkSession, setIsWorkSession] = useState<boolean>(true);
  const [history, setHistory] = useState<PomodoroHistoryItem[]>(() =>
    safeReadFromStorage<PomodoroHistoryItem[]>(STORAGE_KEYS.pomodoroHistory, [])
  );

  // タイトルにカウントダウンを表示する効果
  useEffect(() => {
    const originalTitle = document.title;
    if (isActive) {
      const statusLabel = isWorkSession ? '作業中' : '休憩中';
      document.title = `(${formatTimerTime(timeLeft)}) ${statusLabel} | ${originalTitle.split(' | ').pop()}`;
    } else {
      document.title = originalTitle.includes('|')
        ? originalTitle
        : `Pomodoro Focus Timer | ${originalTitle}`;
    }

    return () => {
      document.title = originalTitle;
    };
  }, [timeLeft, isActive, isWorkSession]);

  const playSound = useCallback(
    (type: PomodoroSound) => {
      if (!soundEnabled && type === 'complete') return;
      if (!tickSoundEnabled && type === 'tick') return;
      playPomodoroSound(type, currentTheme);
    },
    [soundEnabled, tickSoundEnabled, currentTheme]
  );

  const appendHistory = useCallback(
    (item: PomodoroHistoryItem) => {
      const newHistory = [item, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(newHistory);
      safeWriteToStorage(STORAGE_KEYS.pomodoroHistory, newHistory);
    },
    [history]
  );

  /** 指定セッションへ切り替え、その所要時間でタイマーを再設定する。 */
  const startSession = useCallback(
    (work: boolean, workMinutes = workTime, breakMinutes = breakTime) => {
      setIsWorkSession(work);
      const duration = (work ? workMinutes : breakMinutes) * 60;
      setTimeLeft(duration);
      setTotalDuration(duration);
    },
    [workTime, breakTime]
  );

  // セッション終了ハンドラ
  const handleSessionComplete = useCallback(() => {
    playSound('complete');
    appendHistory(
      createHistoryItem(isWorkSession, isWorkSession ? workTime : breakTime, 'completed')
    );
    startSession(!isWorkSession);
  }, [isWorkSession, workTime, breakTime, appendHistory, playSound, startSession]);

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
  }, [isActive, timeLeft, playSound, handleSessionComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);

    // 中断ログを保存（作業が5秒以上経過していた場合のみ）
    const elapsed = totalDuration - timeLeft;
    if (elapsed > 5 && timeLeft > 0) {
      appendHistory(
        createHistoryItem(isWorkSession, Math.round((elapsed / 60) * 10) / 10, 'interrupted')
      );
    }

    startSession(isWorkSession);
  };

  const skipSession = () => {
    setIsActive(false);

    // スキップされた場合は中断として記録
    const elapsed = totalDuration - timeLeft;
    appendHistory(
      createHistoryItem(isWorkSession, Math.round((elapsed / 60) * 10) / 10 || 0.1, 'interrupted')
    );

    startSession(!isWorkSession);
  };

  const clearHistory = () => {
    setHistory([]);
    safeRemoveFromStorage(STORAGE_KEYS.pomodoroHistory);
  };

  const saveSettings = (w: number, b: number) => {
    const validW = Math.max(1, Math.min(180, w));
    const validB = Math.max(1, Math.min(60, b));
    setWorkTime(validW);
    setBreakTime(validB);
    safeWriteToStorage(STORAGE_KEYS.pomodoroWorkTime, validW);
    safeWriteToStorage(STORAGE_KEYS.pomodoroBreakTime, validB);

    // タイマーが動いていない時は更新
    if (!isActive) startSession(isWorkSession, validW, validB);
  };

  return {
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
    saveSettings,
  };
}
