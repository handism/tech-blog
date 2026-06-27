'use client';

import { useState, useEffect } from 'react';
import { useIsClient } from './useIsClient';

type ProgressData = Record<string, Record<string, boolean>>;

export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressData>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const isClient = useIsClient();

  // クライアントサイドでのマウント時にLocalStorageから読み込む
  useEffect(() => {
    if (!isClient) return;

    const saved = localStorage.getItem('learning-progress');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse learning progress:', e);
      }
    }

    setIsLoaded(true);
  }, [isClient]);

  const toggleComplete = (courseId: string, chapterSlug: string) => {
    const currentCourseProgress = progress[courseId] || {};
    const isCurrentlyComplete = !!currentCourseProgress[chapterSlug];

    const nextProgress = {
      ...progress,
      [courseId]: {
        ...currentCourseProgress,
        [chapterSlug]: !isCurrentlyComplete,
      },
    };

    setProgress(nextProgress);
    localStorage.setItem('learning-progress', JSON.stringify(nextProgress));
  };

  const isCompleted = (courseId: string, chapterSlug: string) => {
    return !!progress[courseId]?.[chapterSlug];
  };

  const getCourseProgress = (courseId: string, totalChapters: number) => {
    if (!isLoaded || totalChapters === 0) {
      return { completedCount: 0, percent: 0 };
    }
    const courseProgress = progress[courseId] || {};
    const completedCount = Object.values(courseProgress).filter(Boolean).length;
    // 総チャプター数を超えないように調整
    const safeCompletedCount = Math.min(completedCount, totalChapters);
    const percent = Math.round((safeCompletedCount / totalChapters) * 100);
    return { completedCount: safeCompletedCount, percent };
  };

  return {
    progress,
    isLoaded,
    isCompleted,
    toggleComplete,
    getCourseProgress,
  };
}
